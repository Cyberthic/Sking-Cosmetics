import { inject, injectable } from "inversify";
import { TYPES } from "../../core/types";
import { IUserCheckoutService } from "../../core/interfaces/services/user/IUserCheckout.service";
import { IUserCheckoutRepository } from "../../core/interfaces/repositories/user/IUserCheckout.repository";
import { ICartRepository } from "../../core/interfaces/repositories/user/ICart.repository";
import { IUserAddressRepository } from "../../core/interfaces/repositories/user/IUserAddress.repository";
import { PlaceOrderDto } from "../../core/dtos/user/userCheckout.dto";
import { IOrder } from "../../models/order.model";
import { CustomError } from "../../utils/customError";
import { StatusCode } from "../../enums/statusCode.enums";
import razorpay from "../../config/razorpay";
import logger from "../../utils/logger";
import { IUserCouponService } from "../../core/interfaces/services/user/IUserCoupon.service";
import { IUserProductRepository } from "../../core/interfaces/repositories/user/IUserProduct.repository";

const ORDER_EXPIRY_MINUTES = 15;

@injectable()
export class UserCheckoutService implements IUserCheckoutService {
    constructor(
        @inject(TYPES.IUserCheckoutRepository) private _checkoutRepository: IUserCheckoutRepository,
        @inject(TYPES.ICartRepository) private _cartRepository: ICartRepository,
        @inject(TYPES.IUserAddressRepository) private _addressRepository: IUserAddressRepository,
        @inject(TYPES.IUserProductRepository) private _productRepository: IUserProductRepository,
        @inject(TYPES.IUserCouponService) private _couponService: IUserCouponService
    ) { }

    async placeOrder(userId: string, data: PlaceOrderDto): Promise<IOrder> {
        // 1. Get Cart
        const cart = await this._cartRepository.findByUserId(userId);
        if (!cart || cart.items.length === 0) {
            throw new CustomError("Cart is empty", StatusCode.BAD_REQUEST);
        }

        // 2. Get Address
        const address = await this._addressRepository.findByIdAndUser(data.addressId, userId);
        if (!address) {
            throw new CustomError("Address not found", StatusCode.NOT_FOUND);
        }

        // 3. Check Stock
        for (const item of cart.items) {
            const product = item.product as any;
            if (item.variantName) {
                const variant = product.variants.find((v: any) => v.size === item.variantName);
                if (!variant) {
                    throw new CustomError(`Variant ${item.variantName} not found for product ${product.name}`, StatusCode.BAD_REQUEST);
                }
                if (variant.stock < item.quantity) {
                    throw new CustomError(`Insufficient stock for ${product.name} (${item.variantName}). Available: ${variant.stock}`, StatusCode.BAD_REQUEST);
                }
            }
        }

        // 4. Calculate Totals
        const totalAmount = cart.items.reduce((acc: number, item: any) => {
            const price = item.price || item.product.price;
            return acc + (price * item.quantity);
        }, 0);

        let discountAmount = 0;
        let couponId = null;

        if (data.couponCode) {
            const couponResult = await this._couponService.applyCoupon(userId, data.couponCode, totalAmount, cart.items);
            discountAmount = couponResult.discountAmount;
            couponId = couponResult.coupon._id;
        }

        const shippingFee = totalAmount > 1000 ? 0 : 49;
        const finalAmount = Math.max(0, totalAmount + shippingFee - discountAmount);

        const expiryTime = new Date();
        expiryTime.setMinutes(expiryTime.getMinutes() + ORDER_EXPIRY_MINUTES);

        const displayId = `SKN-${Date.now().toString().slice(-6)}${Math.floor(1000 + Math.random() * 9000)}`;

        // 5. Create Order
        const orderData: any = {
            displayId,
            user: userId,
            items: cart.items.map((item: any) => ({
                product: item.product._id,
                variantName: item.variantName,
                quantity: item.quantity,
                price: item.price || item.product.price
            })),
            totalAmount,
            shippingFee,
            finalAmount,
            coupon: couponId,
            discountCode: data.couponCode,
            discountAmount: discountAmount,
            shippingAddress: {
                name: address.name,
                email: address.email,
                phoneNumber: address.phoneNumber,
                street: address.street,
                city: address.city,
                state: address.state,
                country: address.country,
                postalCode: address.postalCode,
                addressType: address.type
            },
            paymentMethod: data.paymentMethod,
            paymentStatus: "pending",
            orderStatus: "payment_pending",
            paymentDetails: { paymentGateway: "razorpay" },
            statusHistory: [{
                status: "payment_pending",
                timestamp: new Date(),
                message: "Order initiated. Awaiting payment confirmation."
            }],
            paymentExpiresAt: expiryTime
        };

        if (data.paymentMethod === "online") {
            try {
                const razorpayOrder = await razorpay.orders.create({
                    amount: Math.round(finalAmount * 100),
                    currency: "INR",
                    receipt: `order_rcptid_${displayId}`
                });
                orderData.paymentDetails.gatewayOrderId = razorpayOrder.id;
            } catch (error: any) {
                logger.error("Razorpay Order Creation Error", error);
                throw new CustomError("Failed to initiate payment: " + error.message, StatusCode.INTERNAL_SERVER_ERROR);
            }
        }

        const order = await this._checkoutRepository.createOrder(orderData);

        // 6. Reserve Stock
        try {
            for (const item of cart.items) {
                await this._productRepository.reserveStock(
                    item.product._id!.toString(),
                    item.variantName,
                    item.quantity
                );
            }
        } catch (error) {
            logger.error("Error reserving stock for order: " + order._id, error);
        }

        return order;
    }
}
