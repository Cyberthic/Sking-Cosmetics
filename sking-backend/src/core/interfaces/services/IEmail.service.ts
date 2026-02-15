export interface IEmailService {
    sendOtpEmail(email: string, otp: string): Promise<void>;
    sendForgotPasswordOtpEmail(email: string, otp: string): Promise<void>;
    sendWelcomeEmail(email: string, username: string): Promise<void>;
    sendPasswordResetSuccessEmail(email: string): Promise<void>;

    // Ecommerce Notifications
    sendOrderConfirmationEmail(email: string, orderDetails: any): Promise<void>;
    sendOrderStatusUpdateEmail(email: string, orderDetails: any, status: string): Promise<void>;
    sendProductLaunchEmail(email: string, productDetails: any): Promise<void>; // Sending to one, caller handles bulk
    sendNewOfferEmail(email: string, offerDetails: any): Promise<void>; // Sending to one, caller handles bulk
}