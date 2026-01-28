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

@injectable()
export class UserCheckoutService implements IUserCheckoutService {
    constructor(
        @inject(TYPES.IUserCheckoutRepository) private _checkoutRepository: IUserCheckoutRepository,
        @inject(TYPES.ICartRepository) private _cartRepository: ICartRepository,
        @inject(TYPES.IUserAddressRepository) private _addressRepository: IUserAddressRepository
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

        // 3. Calculate Totals
        const totalAmount = cart.items.reduce((acc: number, item: any) => {
            const price = item.price || item.product.price;
            return acc + (price * item.quantity);
        }, 0);

        const shippingFee = totalAmount > 1000 ? 0 : 49;
        const finalAmount = totalAmount + shippingFee;

        // 4. Create Order
        const orderData = {
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
            shippingAddress: {
                name: address.name,
                email: address.email,
                phoneNumber: address.phoneNumber,
                street: address.street,
                city: address.city,
                state: address.state,
                country: address.country,
                postalCode: address.postalCode
            },
            paymentMethod: data.paymentMethod,
            paymentStatus: "pending",
            orderStatus: "pending"
        };

        const order = await this._checkoutRepository.createOrder(orderData);

        // 5. Clear Cart
        await this._cartRepository.clearCart(userId);

        return order;
    }
}
