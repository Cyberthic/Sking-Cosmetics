import nodemailer, { Transporter } from "nodemailer";
import { injectable } from "inversify";
import { IEmailService } from "../core/interfaces/services/IEmail.service";
import logger from "../utils/logger";
import { CustomError } from "../utils/customError";
import { StatusCode } from "../enums/statusCode.enums";

@injectable()
export class EmailService implements IEmailService {
    private transporter: Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || "587"),
            secure: process.env.SMTP_SECURE === "true",
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        this.verifyConnection();
    }

    private async verifyConnection(): Promise<void> {
        try {
            await this.transporter.verify();
        } catch (error) {
            logger.error("❌ Email service connection failed:", error);
        }
    }

    async sendOtpEmail(email: string, otp: string): Promise<void> {
        const htmlTemplate = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
                    .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
                    .content { padding: 30px; }
                    .otp-code { background-color: #f8f9fa; border: 2px dashed #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
                    .otp-number { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 8px; }
                    .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #666; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>SKING COSMETICS</h1>
                        <p>Verify Your Email Address</p>
                    </div>
                    <div class="content">
                        <h2>Welcome to Sking Cosmetics!</h2>
                        <p>Thank you for registering with us. To complete your registration, please enter the following verification code:</p>
                        
                        <div class="otp-code">
                            <p>Your verification code is:</p>
                            <div class="otp-number">${otp}</div>
                        </div>
                        
                        <p><strong>This code will expire in 5 minutes.</strong></p>
                        <p>If you didn't create an account with Sking Cosmetics, please ignore this email.</p>
                    </div>
                    <div class="footer">
                        <p>&copy; ${new Date().getFullYear()} Sking Cosmetics. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        await this.sendEmail(
            email,
            "Verify Your Sking Cosmetics Account",
            `Your verification code is: ${otp}`,
            htmlTemplate
        );
    }

    async sendForgotPasswordOtpEmail(email: string, otp: string): Promise<void> {
        const htmlTemplate = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
                    .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                    .header { background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); color: white; padding: 30px; text-align: center; }
                    .content { padding: 30px; }
                    .otp-code { background-color: #fff5f5; border: 2px dashed #ff6b6b; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
                    .otp-number { font-size: 32px; font-weight: bold; color: #ff6b6b; letter-spacing: 8px; }
                    .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #666; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>SKING COSMETICS</h1>
                        <p>Password Reset Request</p>
                    </div>
                    <div class="content">
                        <h2>Reset Your Password</h2>
                        <p>You have requested to reset your password. Please enter the following verification code to proceed:</p>
                        
                        <div class="otp-code">
                            <p>Your reset code is:</p>
                            <div class="otp-number">${otp}</div>
                        </div>
                        
                        <p><strong>This code will expire in 5 minutes.</strong></p>
                        <p>If you didn't request a password reset, please ignore this email and your password will remain unchanged.</p>
                    </div>
                    <div class="footer">
                        <p>&copy; ${new Date().getFullYear()} Sking Cosmetics. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        await this.sendEmail(
            email,
            "Reset Your Sking Cosmetics Password",
            `Your password reset code is: ${otp}`,
            htmlTemplate
        );
    }

    async sendWelcomeEmail(email: string, username: string): Promise<void> {
        const htmlTemplate = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
                    .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                    .header { background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%); color: white; padding: 30px; text-align: center; }
                    .content { padding: 30px; }
                    .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #666; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>SKING COSMETICS</h1>
                        <p>Welcome to Our Beauty Community!</p>
                    </div>
                    <div class="content">
                        <h2>Welcome ${username}!</h2>
                        <p>Congratulations! Your Sking Cosmetics account has been successfully created.</p>
                        <p>You're now part of our exclusive beauty community where luxury meets innovation.</p>
                        <p>Get ready to discover our curated collection of premium skincare products designed to enhance your natural beauty.</p>
                        <p>Start exploring and enjoy your journey with us!</p>
                    </div>
                    <div class="footer">
                        <p>&copy; ${new Date().getFullYear()} Sking Cosmetics. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        await this.sendEmail(
            email,
            "Welcome to Sking Cosmetics!",
            `Welcome ${username}! Your account has been created successfully.`,
            htmlTemplate
        );
    }

    async sendPasswordResetSuccessEmail(email: string): Promise<void> {
        const htmlTemplate = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
                    .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                    .header { background: linear-gradient(135deg, #3498db 0%, #2980b9 100%); color: white; padding: 30px; text-align: center; }
                    .content { padding: 30px; }
                    .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #666; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>SKING COSMETICS</h1>
                        <p>Password Reset Successful</p>
                    </div>
                    <div class="content">
                        <h2>Password Updated Successfully</h2>
                        <p>Your password has been successfully updated.</p>
                        <p>If you didn't make this change, please contact our support team immediately.</p>
                        <p>For your security, we recommend using a strong, unique password.</p>
                    </div>
                    <div class="footer">
                        <p>&copy; ${new Date().getFullYear()} Sking Cosmetics. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        await this.sendEmail(
            email,
            "Password Reset Successful - Sking Cosmetics",
            "Your password has been successfully updated.",
            htmlTemplate
        );
    }

    async sendOrderConfirmationEmail(email: string, order: any): Promise<void> {
        const itemsList = order.items.map((item: any) => `
            <div style="display: flex; align-items: center; border-bottom: 1px solid #eee; padding: 10px 0;">
                <img src="${item.product?.images?.[0] || 'https://via.placeholder.com/60'}" alt="${item.product?.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px; margin-right: 15px;">
                <div style="flex: 1;">
                    <p style="margin: 0; font-weight: bold; color: #333;">${item.product?.name || 'Product'}</p>
                    <p style="margin: 5px 0 0; color: #666; font-size: 14px;">Qty: ${item.quantity} x ₹${item.price}</p>
                </div>
                <div style="font-weight: bold; color: #333;">₹${item.quantity * item.price}</div>
            </div>
        `).join('');

        const htmlTemplate = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f9fafb; margin: 0; padding: 0; }
                    .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
                    .header { background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); padding: 40px 20px; text-align: center; color: white; }
                    .header h1 { margin: 0; font-size: 24px; letter-spacing: 1px; font-weight: 700; }
                    .header p { margin: 10px 0 0; opacity: 0.9; font-size: 16px; }
                    .content { padding: 30px; }
                    .order-info { background-color: #f3f4f6; border-radius: 8px; padding: 15px; margin-bottom: 25px; display: flex; justify-content: space-between; }
                    .order-info div { font-size: 14px; color: #555; }
                    .order-info strong { display: block; color: #333; font-size: 16px; margin-top: 5px; }
                    .section-title { font-size: 18px; font-weight: 600; color: #111; margin-bottom: 15px; border-bottom: 2px solid #6366f1; display: inline-block; padding-bottom: 5px; }
                    .total-section { margin-top: 20px; text-align: right; border-top: 2px solid #f3f4f6; padding-top: 15px; }
                    .total-row { display: flex; justify-content: flex-end; margin-bottom: 8px; font-size: 14px; color: #666; }
                    .total-row.final { font-size: 20px; font-weight: 700; color: #4f46e5; margin-top: 10px; }
                    .total-label { margin-right: 20px; }
                    .address-section { margin-top: 30px; background-color: #f9fafb; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; }
                    .footer { background-color: #1f2937; color: #9ca3af; padding: 25px; text-align: center; font-size: 13px; }
                    .btn { display: inline-block; background-color: #4f46e5; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: 600; margin-top: 25px; text-align: center; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>ORDER CONFIRMED</h1>
                        <p>Thank you for your purchase!</p>
                    </div>
                    <div class="content">
                        <p style="color: #4b5563; line-height: 1.6;">Hi ${order.user?.name || 'Customer'},</p>
                        <p style="color: #4b5563; line-height: 1.6;">We've received your order and are getting it ready! We'll notify you once it's on its way.</p>
                        
                        <div class="order-info">
                            <div>Order ID: <strong>#${order.displayId || order._id.toString().slice(-6).toUpperCase()}</strong></div>
                            <div>Date: <strong>${new Date().toLocaleDateString()}</strong></div>
                        </div>

                        <div class="section-title">Order Summary</div>
                        ${itemsList}

                        <div class="total-section">
                            <div class="total-row">
                                <span class="total-label">Subtotal:</span>
                                <span>₹${order.totalAmount}</span>
                            </div>
                            <div class="total-row">
                                <span class="total-label">Shipping:</span>
                                <span>₹${order.shippingCost || 0}</span>
                            </div>
                            <div class="total-row">
                                <span class="total-label">Discount:</span>
                                <span>- ₹${order.discountAmount || 0}</span>
                            </div>
                            <div class="total-row final">
                                <span class="total-label">Total:</span>
                                <span>₹${order.finalAmount}</span>
                            </div>
                        </div>

                        <div class="address-section">
                            <div class="section-title" style="font-size: 16px; border-bottom: 1px solid #d1d5db;">Shipping Address</div>
                            <p style="margin: 10px 0 0; color: #4b5563; line-height: 1.5;">
                                ${order.shippingAddress?.fullName}<br>
                                ${order.shippingAddress?.streetAddress}<br>
                                ${order.shippingAddress?.city}, ${order.shippingAddress?.state} - ${order.shippingAddress?.postalCode}<br>
                                ${order.shippingAddress?.country}<br>
                                Phone: ${order.shippingAddress?.phoneNumber}
                            </p>
                        </div>
                        
                        <div style="text-align: center;">
                            <a href="${process.env.FRONTEND_URL}/orders/${order._id}" class="btn">View Order Details</a>
                        </div>
                    </div>
                    <div class="footer">
                        <p>&copy; ${new Date().getFullYear()} Sking Cosmetics. All rights reserved.</p>
                        <p>Questions? Contact us at support@skingcosmetics.com</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        await this.sendEmail(
            email,
            `Order Confirmation #${order.displayId || order._id.toString().slice(-6)} - Sking Cosmetics`,
            `Thank you for your order! Your order #${order.displayId} has been confirmed. Total: ₹${order.finalAmount}`,
            htmlTemplate
        );
    }

    async sendOrderStatusUpdateEmail(email: string, order: any, status: string): Promise<void> {
        let statusMessage = "Your order status has been updated.";
        let statusColor = "#3b82f6"; // blue default

        switch (status.toLowerCase()) {
            case 'processing':
                statusMessage = "We are now processing your order and packing needs carefully.";
                statusColor = "#f59e0b";
                break;
            case 'shipped':
                statusMessage = "Great news! Your order is on its way to you.";
                statusColor = "#8b5cf6";
                break;
            case 'delivered':
                statusMessage = "Your order has been delivered! We hope you love your new products.";
                statusColor = "#10b981";
                break;
            case 'cancelled':
                statusMessage = "Your order has been cancelled as per request or due to an issue.";
                statusColor = "#ef4444";
                break;
        }

        const htmlTemplate = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f9fafb; margin: 0; padding: 0; }
                    .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
                    .header { background-color: #1f2937; padding: 30px 20px; text-align: center; color: white; }
                    .content { padding: 40px 30px; text-align: center; }
                    .status-badge { display: inline-block; background-color: ${statusColor}; color: white; padding: 10px 25px; border-radius: 50px; font-size: 18px; font-weight: bold; margin: 20px 0; letter-spacing: 1px; text-transform: uppercase; box-shadow: 0 4px 10px rgba(0,0,0,0.2); }
                    .message { font-size: 16px; color: #4b5563; line-height: 1.6; margin-bottom: 30px; }
                    .order-ref { background-color: #f3f4f6; padding: 15px; border-radius: 8px; display: inline-block; color: #6b7280; font-size: 14px; margin-bottom: 20px; }
                    .order-ref strong { color: #111; }
                    .btn { display: inline-block; background-color: #111; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; transition: background 0.3s; }
                    .btn:hover { background-color: #333; }
                    .footer { background-color: #f9fafb; color: #9ca3af; padding: 20px; text-align: center; font-size: 12px; border-top: 1px solid #eee; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <img src="https://via.placeholder.com/150x50?text=SKING+COSMETICS" alt="Sking Cosmetics" style="height: 40px; margin-bottom: 10px;">
                        <h2 style="margin: 0; font-weight: 400; color: #e5e7eb;">Order Update</h2>
                    </div>
                    <div class="content">
                        <h1 style="color: #111; margin-bottom: 15px; font-size: 24px;">Status Changed</h1>
                        <p class="message">Your order status has been updated to:</p>
                        
                        <div class="status-badge">${status}</div>
                        
                        <p class="message">${statusMessage}</p>
                        
                        <div class="order-ref">
                            Order #${order.displayId || order._id.toString().slice(-6)}
                        </div>
                        
                        <div style="margin-top: 20px;">
                            <a href="${process.env.FRONTEND_URL}/orders/${order._id}" class="btn">Track Order</a>
                        </div>
                    </div>
                    <div class="footer">
                        <p>&copy; ${new Date().getFullYear()} Sking Cosmetics. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        await this.sendEmail(
            email,
            `Order #${order.displayId || order._id.toString().slice(-6)} Updated: ${status}`,
            `Your order status has been updated to ${status}.`,
            htmlTemplate
        );
    }

    async sendProductLaunchEmail(email: string, product: any): Promise<void> {
        const htmlTemplate = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 0; }
                    .container { max-width: 600px; margin: 0 auto; background-color: white; overflow: hidden; }
                    .hero { position: relative; width: 100%; height: 300px; background-color: #eee; background-image: url('${product.images?.[0] || 'https://via.placeholder.com/600x300'}'); background-size: cover; background-position: center; }
                    .hero-overlay { position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top, rgba(0,0,0,0.7), transparent); padding: 40px 20px 20px; color: white; }
                    .tag { background-color: #000; color: white; padding: 5px 15px; text-transform: uppercase; font-size: 12px; font-weight: bold; letter-spacing: 2px; display: inline-block; margin-bottom: 10px; }
                    .content { padding: 40px 30px; text-align: center; }
                    .product-name { font-size: 32px; font-weight: bold; margin: 0 0 15px; color: #111; letter-spacing: -0.5px; }
                    .product-desc { font-size: 16px; color: #666; line-height: 1.6; margin-bottom: 30px; max-width: 400px; margin-left: auto; margin-right: auto; }
                    .price { font-size: 24px; font-weight: bold; color: #111; margin-bottom: 30px; }
                    .btn { display: inline-block; background-color: #000; color: white; padding: 18px 40px; text-decoration: none; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; font-size: 14px; transition: background 0.3s; }
                    .btn:hover { background-color: #333; }
                    .features { background-color: #f9f9f9; padding: 40px 20px; text-align: center; border-top: 1px solid #eee; margin-top: 30px; }
                    .footer { background-color: #111; color: #666; padding: 40px 20px; text-align: center; font-size: 12px; }
                    .social-links { margin-bottom: 20px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="hero">
                        <div class="hero-overlay">
                            <div class="tag">New Arrival</div>
                        </div>
                    </div>
                    <div class="content">
                        <h1 class="product-name">${product.name}</h1>
                        <p class="product-desc">${product.description ? product.description.substring(0, 150) + '...' : 'Experience our latest innovation in beauty.'}</p>
                        <div class="price">₹${product.price}</div>
                        <a href="${process.env.FRONTEND_URL}/products/${product._id}" class="btn">Shop Now</a>
                    </div>
                    <div class="footer">
                        <p>You received this email because you are subscribed to Sking Cosmetics updates.</p>
                        <p>&copy; ${new Date().getFullYear()} Sking Cosmetics. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        await this.sendEmail(
            email,
            `Introducing: ${product.name} - Sking Cosmetics`,
            `Check out our new product: ${product.name}. Available now for ₹${product.price}`,
            htmlTemplate
        );
    }

    async sendNewOfferEmail(email: string, offer: any): Promise<void> {
        const discountText = offer.discountType === 'percentage' ? `${offer.discountValue}% OFF` : `₹${offer.discountValue} OFF`;

        const htmlTemplate = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
                    .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
                    .header { background: radial-gradient(circle at center, #ff9f43 0%, #ee5253 100%); padding: 50px 20px; text-align: center; color: white; }
                    .offer-badge { background-color: white; color: #ee5253; padding: 5px 15px; text-transform: uppercase; font-weight: bold; letter-spacing: 2px; font-size: 14px; display: inline-block; margin-bottom: 15px; border-radius: 4px; }
                    .discount-big { font-size: 64px; font-weight: 800; line-height: 1; margin: 10px 0; letter-spacing: -2px; text-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                    .content { padding: 40px 30px; text-align: center; background-image: url('https://www.transparenttextures.com/patterns/cubes.png'); }
                    .offer-desc { font-size: 18px; color: #555; margin-bottom: 30px; font-weight: 300; line-height: 1.5; }
                    .code-box { background-color: #f3f4f6; border: 2px dashed #d1d5db; padding: 20px; border-radius: 8px; margin: 0 auto 30px; max-width: 300px; }
                    .code-label { font-size: 12px; text-transform: uppercase; color: #6b7280; letter-spacing: 1px; margin-bottom: 5px; }
                    .promo-code { font-size: 28px; font-weight: bold; color: #111; letter-spacing: 2px; font-family: monospace; }
                    .btn { display: inline-block; background-color: #ee5253; color: white; padding: 15px 40px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(238, 82, 83, 0.4); transition: transform 0.2s; }
                    .btn:hover { transform: translateY(-2px); }
                    .expiry { margin-top: 30px; font-size: 13px; color: #999; }
                    .footer { background-color: #1f2937; color: #9ca3af; padding: 20px; text-align: center; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <div class="offer-badge">Special Offer</div>
                        <div class="discount-big">${discountText}</div>
                        <p style="margin: 0; opacity: 0.9; font-size: 18px;">On your next purchase</p>
                    </div>
                    <div class="content">
                        <p class="offer-desc">${offer.description || 'Don\'t miss out on this limited time offer to save on your favorite beauty products!'}</p>
                        
                        <div class="code-box">
                            <div class="code-label">Use Code At Checkout</div>
                            <div class="promo-code">${offer.code}</div>
                        </div>
                        
                        <a href="${process.env.FRONTEND_URL}/products" class="btn">Claim Offer Now</a>
                        
                        <div class="expiry">
                            Offer expires on ${new Date(offer.expiresAt).toLocaleDateString()}
                        </div>
                    </div>
                    <div class="footer">
                        <p>&copy; ${new Date().getFullYear()} Sking Cosmetics. All rights reserved.</p>
                        <p>Terms and conditions apply. One use per customer.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        await this.sendEmail(
            email,
            `Special Offer: ${discountText} - Sking Cosmetics`,
            `Use code ${offer.code} to get ${discountText} on your next order!`,
            htmlTemplate
        );
    }

    private async sendEmail(to: string, subject: string, text: string, html?: string): Promise<void> {
        try {
            await this.transporter.sendMail({
                from: {
                    name: process.env.FROM_NAME || "Sking Cosmetics",
                    address: process.env.FROM_EMAIL || process.env.SMTP_USER || "",
                },
                to,
                subject,
                text,
                html,
            });

            logger.info(`📧 Email sent successfully to ${to}`);
        } catch (error: any) {
            logger.error("❌ Failed to send email:", error);

            if (error.responseCode === 535) {
                logger.error("🔐 SMTP Authentication Error: Username and Password not accepted.");
                logger.error("💡 TIP: If you are using Gmail, you MUST use an 'App Password' instead of your regular password.");
                logger.error("   1. Go to Google Account > Security");
                logger.error("   2. Enable 2-Step Verification");
                logger.error("   3. Go to 'App passwords' (search for it in the search bar)");
                logger.error("   4. Generate a new password and use it in your .env file as SMTP_PASS");
            }

            throw new CustomError("Failed to send email", StatusCode.INTERNAL_SERVER_ERROR);
        }
    }
}