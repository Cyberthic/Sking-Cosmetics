import { inject, injectable } from "inversify";
import bcrypt from "bcryptjs";
import { TYPES } from "../../core/types";
import { IUserAuthService } from "../../core/interfaces/services/user/IUserAuth.service";
import { IUserAuthRepository } from "../../core/interfaces/repositories/user/IUserAuth.repository";
import { IJwtService } from "../../core/interfaces/services/IJwtService";
import { IUser } from "../../models/user.model";
import { CustomError } from "../../utils/customError";
import { StatusCode } from "../../enums/statusCode.enums";
import { OAuth2Client } from "google-auth-library";
import logger from "../../utils/logger";
import crypto from "crypto";

@injectable()
export class UserAuthService implements IUserAuthService {
    private googleClient: OAuth2Client;

    constructor(
        @inject(TYPES.IUserAuthRepository) private _userAuthRepository: IUserAuthRepository,
        @inject(TYPES.IJwtService) private _jwtService: IJwtService
    ) {
        this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    }

    async registerUser(
        username: string,
        email: string,
        password?: string,
        name?: string,
        referralCode?: string
    ): Promise<void> {
        const existingUserByEmail = await this._userAuthRepository.findByEmail(email);
        if (existingUserByEmail) {
            throw new CustomError("Email already registered", StatusCode.CONFLICT);
        }

        const existingUserByUsername = await this._userAuthRepository.findByUsername(username);
        if (existingUserByUsername) {
            throw new CustomError("Username already taken", StatusCode.CONFLICT);
        }
    }

    async verifyAndRegisterUser(
        username: string,
        email: string,
        password?: string,
        name?: string,
        referralCode?: string
    ): Promise<{ user: IUser; accessToken: string; refreshToken: string }> {
        await this.registerUser(username, email, password, name, referralCode);

        let hashedPassword = "";
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        const newUser = await this._userAuthRepository.create({
            username,
            email,
            password: hashedPassword,
            isActive: true,
        });

        const accessToken = this._jwtService.generateAccessToken(newUser._id.toString(), "user", 0);
        const refreshToken = this._jwtService.generateRefreshToken(newUser._id.toString(), "user", 0);

        return { user: newUser, accessToken, refreshToken };
    }

    async checkUsernameAvailability(username: string): Promise<boolean> {
        const user = await this._userAuthRepository.findByUsername(username);
        return !user;
    }

    async generateUsername(): Promise<string> {
        let username: string;
        let isUnique = false;
        do {
            username = `user_${crypto.randomBytes(4).toString("hex")}`;
            isUnique = await this.checkUsernameAvailability(username);
        } while (!isUnique);
        return username;
    }

    async loginUser(email: string, password?: string): Promise<{ user: IUser; accessToken: string; refreshToken: string }> {
        const user = await this._userAuthRepository.findByEmail(email);
        if (!user) {
            throw new CustomError("Invalid credentials", StatusCode.UNAUTHORIZED);
        }

        if (!user.password || !password) {
            throw new CustomError("Invalid credentials", StatusCode.UNAUTHORIZED);
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new CustomError("Invalid credentials", StatusCode.UNAUTHORIZED);
        }

        const accessToken = this._jwtService.generateAccessToken(user._id.toString(), "user", 0);
        const refreshToken = this._jwtService.generateRefreshToken(user._id.toString(), "user", 0);

        return { user, accessToken, refreshToken };
    }

    async requestForgotPassword(email: string): Promise<void> {
        const user = await this._userAuthRepository.findByEmail(email);
        if (!user) {
            throw new CustomError("User not found", StatusCode.NOT_FOUND);
        }
    }

    async resetPassword(email: string, newPassword?: string): Promise<void> {
        if (!newPassword) throw new CustomError("Password required", StatusCode.BAD_REQUEST);

        const user = await this._userAuthRepository.findByEmail(email);
        if (!user) {
            throw new CustomError("User not found", StatusCode.NOT_FOUND);
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this._userAuthRepository.update(user._id.toString(), { password: hashedPassword });
    }

    async loginWithGoogle(idToken: string, referralCode?: string): Promise<{ user: IUser; accessToken: string; refreshToken: string }> {
        try {
            const ticket = await this.googleClient.verifyIdToken({
                idToken,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            const payload = ticket.getPayload();

            if (!payload || !payload.email) {
                throw new CustomError("Invalid Google Token", StatusCode.UNAUTHORIZED);
            }

            const email = payload.email;
            let user = await this._userAuthRepository.findByEmail(email);

            if (!user) {
                const username = await this.generateUsername();
                user = await this._userAuthRepository.create({
                    email,
                    username,
                    isActive: true,
                });
            }

            const accessToken = this._jwtService.generateAccessToken(user._id.toString(), "user", 0);
            const refreshToken = this._jwtService.generateRefreshToken(user._id.toString(), "user", 0);

            return { user, accessToken, refreshToken };

        } catch (error) {
            logger.error("Google verify error", error);
            throw new CustomError("Google Authentication Failed", StatusCode.UNAUTHORIZED);
        }
    }
}
