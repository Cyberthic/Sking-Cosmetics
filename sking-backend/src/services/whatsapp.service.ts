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

    private async sendMessage(to: string, body: string, options: { contentSid?: string, contentVariables?: string } = {}): Promise<void> {
        try {
            if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
                logger.error("❌ Cannot send WhatsApp: Missing Twilio credentials in environment.");
                return;
            }

            let cleanNumber = to.replace(/\s+/g, '').replace(/[-()]/g, '');
            let formattedTo = cleanNumber;

            if (!formattedTo.startsWith("whatsapp:")) {
                if (!formattedTo.startsWith("+")) {
                    formattedTo = formattedTo.length === 10 ? "+91" + formattedTo : "+" + formattedTo;
                }
                formattedTo = "whatsapp:" + formattedTo;
            }

            const messageData: any = {
                from: this.fromNumber,
                to: formattedTo
            };

            if (options.contentSid) {
                messageData.contentSid = options.contentSid;
                messageData.contentVariables = options.contentVariables;
            } else {
                messageData.body = body;
            }

            await this.client.messages.create(messageData);
            logger.info(`✅ WhatsApp message sent to ${formattedTo} [Template: ${options.contentSid || 'None'}]`);
        } catch (error) {
            logger.error(`❌ Failed to send WhatsApp message to ${to}:`, error);
        }
    }

    async sendOrderSuccessMessage(order: IOrder): Promise<void> {
        const orderLink = `${process.env.FRONTEND_URL}/orders/${order.displayId}`;
        const itemsList = order.items.map(item => `${item.quantity}x ${(item.product as any).name || 'Product'}`).join(", ");

        if (process.env.NODE_ENV === 'production' && process.env.TWILIO_TEMPLATE_SUCCESS_SID) {
            await this.sendMessage(order.shippingAddress.phoneNumber, "", {
                contentSid: process.env.TWILIO_TEMPLATE_SUCCESS_SID,
                contentVariables: JSON.stringify({
                    "1": order.shippingAddress.name,
                    "2": order.displayId,
                    "3": itemsList,
                    "4": order.finalAmount.toString(),
                    "5": orderLink
                })
            });
        } else {
            const body = `*Order Placed Successfully!* 🛍️\n\n` +
                `Hi ${order.shippingAddress.name},\n` +
                `Your order *#${order.displayId}* has been confirmed.\n\n` +
                `*Items:* ${itemsList}\n` +
                `*Total Amount:* ₹${order.finalAmount}\n\n` +
                `*View Details:* ${orderLink}\n\n` +
                `Thank you for shopping with Sking Cosmetics! ✨`;
            await this.sendMessage(order.shippingAddress.phoneNumber, body);
        }
    }

    async sendOrderFailureMessage(order: IOrder): Promise<void> {
        if (process.env.NODE_ENV === 'production' && process.env.TWILIO_TEMPLATE_FAILURE_SID) {
            await this.sendMessage(order.shippingAddress.phoneNumber, "", {
                contentSid: process.env.TWILIO_TEMPLATE_FAILURE_SID,
                contentVariables: JSON.stringify({
                    "1": order.shippingAddress.name,
                    "2": order.displayId
                })
            });
        } else {
            const body = `*Order Payment Failed* ❌\n\n` +
                `Hi ${order.shippingAddress.name},\n` +
                `The payment for your order *#${order.displayId}* has failed.\n\n` +
                `Please try again from your profile or contact support.`;
            await this.sendMessage(order.shippingAddress.phoneNumber, body);
        }
    }

    async sendOrderStatusUpdateMessage(order: IOrder): Promise<void> {
        const orderLink = `${process.env.FRONTEND_URL}/orders/${order.displayId}`;

        if (process.env.NODE_ENV === 'production' && process.env.TWILIO_TEMPLATE_UPDATE_SID) {
            await this.sendMessage(order.shippingAddress.phoneNumber, "", {
                contentSid: process.env.TWILIO_TEMPLATE_UPDATE_SID,
                contentVariables: JSON.stringify({
                    "1": order.orderStatus.toUpperCase(),
                    "2": order.shippingAddress.name,
                    "3": order.displayId,
                    "4": orderLink
                })
            });
        } else {
            let statusEmoji = "📦";
            if (order.orderStatus === "shipped") statusEmoji = "🚚";
            if (order.orderStatus === "delivered") statusEmoji = "✅";
            if (order.orderStatus === "cancelled") statusEmoji = "🚫";

            const body = `*Order Update: ${order.orderStatus.toUpperCase()}* ${statusEmoji}\n\n` +
                `Hi ${order.shippingAddress.name},\n` +
                `Your order *#${order.displayId}* status has changed to ${order.orderStatus}.\n\n` +
                `*View Details:* ${orderLink}\n\n` +
                `Thank you!`;
            await this.sendMessage(order.shippingAddress.phoneNumber, body);
        }
    }
}
