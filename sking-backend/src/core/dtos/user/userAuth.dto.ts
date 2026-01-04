import { IUser } from "../../../models/user.model";

export class UserRegisterDto {
    username?: string;
    email?: string;
    password?: string;
    name?: string;
    referralCode?: string;
}

export class UserLoginDto {
    email?: string;
    password?: string;
}

export class VerifyOtpDto {
    username?: string;
    email?: string;
    password?: string;
    name?: string;
    otp?: string;
    referralCode?: string;
}

export class CheckUsernameDto {
    username?: string;
}

export class ForgotPasswordDto {
    email?: string;
}

export class ResetPasswordDto {
    email?: string;
    newPassword?: string;
}

export class RequestOtpDto {
    email?: string;
}

export class GoogleLoginDto {
    token?: string;
    referralCode?: string;
}

export class LoginResponseDto {
    user: IUser;
    accessToken: string;
    message: string;

    constructor(user: IUser, accessToken: string, message: string) {
        this.user = user;
        this.accessToken = accessToken;
        this.message = message;
    }
}

export class RegisterResponseDto {
    message: string;

    constructor(message: string) {
        this.message = message;
    }
}

export class UsernameCheckResponseDto {
    isAvailable: boolean;

    constructor(isAvailable: boolean) {
        this.isAvailable = isAvailable;
    }
}
