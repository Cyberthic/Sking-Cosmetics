export interface IOTPService {
    requestOtp(email: string, type: string): Promise<void>;
    verifyOtp(email: string, otp: string): Promise<boolean>;
    requestForgotPasswordOtp(email: string, type: string): Promise<void>;
}
