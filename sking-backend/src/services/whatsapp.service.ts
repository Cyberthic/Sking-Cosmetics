import { injectable } from "inversify";
import { IWhatsappService } from "../core/interfaces/services/IWhatsapp.service";
import { IOrder } from "../models/order.model";
import twilio from "twilio";
import logger from "../utils/logger";

@injectable()
export class WhatsappService implements IWhatsappService {
    private client: twilio.Twilio;
    private fromNumber: string;

    constructor() {
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        this.fromNumber = process.env.TWILIO_WHATSAPP_NUMBER || "whatsapp:+14155238886";

        if (!accountSid) logger.warn("⚠️ TWILIO_ACCOUNT_SID is missing in .env");
        if (!authToken) logger.warn("⚠️ TWILIO_AUTH_TOKEN is missing in .env");

        this.client = twilio(accountSid || '', authToken || '');
    }

    private async sendMessage(to: string, body: string): Promise<void> {
        try {
            if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
                logger.error("❌ Cannot send WhatsApp: Missing Twilio credentials in environment.");
                return;
            }

            let cleanNumber = to.replace(/\s+/g, '').replace(/[-()]/g, '');
            let formattedTo = cleanNumber;

            if (!formattedTo.startsWith("whatsapp:")) {
                if (!formattedTo.startsWith("+")) {
                    // Default to India (+91) if 10 digits and no prefix, or adjust as needed
                    if (formattedTo.length === 10) {
                        formattedTo = "+91" + formattedTo;
                    } else if (!formattedTo.startsWith("+")) {
                        formattedTo = "+" + formattedTo;
                    }
                }
                formattedTo = "whatsapp:" + formattedTo;
            }

            await this.client.messages.create({
                body: body,
                from: this.fromNumber,
                to: formattedTo
            });
            logger.info(`✅ WhatsApp message sent to ${formattedTo}`);
        } catch (error) {
            logger.error(`❌ Failed to send WhatsApp message to ${to}:`, error);
        }
    }

    async sendOrderSuccessMessage(order: IOrder): Promise<void> {
        const itemsList = order.items.map(item => `- ${item.quantity}x ${(item.product as any).name || 'Product'} (${item.variantName || 'Standard'})`).join("\n");
        const orderLink = `${process.env.FRONTEND_URL}/orders/${order.displayId}`;
        const body = `*Order Placed Successfully!* 🛍️\n\n` +
            `Hi ${order.shippingAddress.name},\n` +
            `Your order *#${order.displayId}* has been confirmed.\n\n` +
            `*Items:* \n${itemsList}\n\n` +
            `*Total Amount:* ₹${order.finalAmount}\n` +
            `*Status:* Processing\n\n` +
            `*View Invoice/Details:* ${orderLink}\n\n` +
            `Thank you for shopping with Sking Cosmetics! ✨`;

        await this.sendMessage(order.shippingAddress.phoneNumber, body);
    }

    async sendOrderFailureMessage(order: IOrder): Promise<void> {
        const body = `*Order Payment Failed* ❌\n\n` +
            `Hi ${order.shippingAddress.name},\n` +
            `The payment for your order *#${order.displayId}* has failed.\n\n` +
            `Don't worry, your items are still reserved for a short time. You can try place the order again from your profile.\n\n` +
            `If you need help, contact our support.`;

        await this.sendMessage(order.shippingAddress.phoneNumber, body);
    }

    async sendOrderStatusUpdateMessage(order: IOrder): Promise<void> {
        let statusEmoji = "📦";
        let messageText = "";

        switch (order.orderStatus) {
            case "processing":
                statusEmoji = "⚙️";
                messageText = "is now being processed.";
                break;
            case "shipped":
                statusEmoji = "🚚";
                messageText = "has been shipped and is on its way!";
                break;
            case "delivered":
                statusEmoji = "✅";
                messageText = "has been delivered! We hope you love your products.";
                break;
            case "cancelled":
                statusEmoji = "🚫";
                messageText = "has been cancelled.";
                break;
        }

        const orderLink = `${process.env.FRONTEND_URL}/orders/${order.displayId}`;
        const body = `*Order Update: ${order.orderStatus.toUpperCase()}* ${statusEmoji}\n\n` +
            `Hi ${order.shippingAddress.name},\n` +
            `Your order *#${order.displayId}* ${messageText}\n\n` +
            `*Total Amount:* ₹${order.finalAmount}\n\n` +
            `*View Details:* ${orderLink}\n\n` +
            `Thank you for choosing Sking Cosmetics!`;

        await this.sendMessage(order.shippingAddress.phoneNumber, body);
    }
}
