import { injectable } from "inversify";
import { IOTPService } from "../../core/interfaces/services/IOTP.service";
import logger from "../../utils/logger";
import { CustomError } from "../../utils/customError";
import { StatusCode } from "../../enums/statusCode.enums";

@injectable()
export class OTPService implements IOTPService {
    private otpStore: Map<string, { otp: string; expires: number }> = new Map();

    async requestOtp(email: string, type: string): Promise<void> {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expires = Date.now() + 5 * 60 * 1000; // 5 minutes

        this.otpStore.set(email, { otp, expires });

        // In production, use NodeMailer or SMS service
        logger.info(`OTP for ${email} (${type}): ${otp}`);
    }

    async verifyOtp(email: string, otp: string): Promise<boolean> {
        const record = this.otpStore.get(email);
        if (!record) {
            throw new CustomError("OTP not found or expired", StatusCode.BAD_REQUEST);
        }

        if (Date.now() > record.expires) {
            this.otpStore.delete(email);
            throw new CustomError("OTP expired", StatusCode.BAD_REQUEST);
        }

        if (record.otp !== otp) {
            throw new CustomError("Invalid OTP", StatusCode.BAD_REQUEST);
        }

        this.otpStore.delete(email); // consume OTP
        return true;
    }

    async requestForgotPasswordOtp(email: string, type: string): Promise<void> {
        return this.requestOtp(email, type);
    }
}
