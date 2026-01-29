import { inject, injectable } from "inversify";
import { TYPES } from "../../core/types";
import { IAdminCustomerService } from "../../core/interfaces/services/admin/IAdminCustomer.service";
import { IAdminCustomerRepository } from "../../core/interfaces/repositories/admin/IAdminCustomer.repository";
import { IUserOrderRepository } from "../../core/interfaces/repositories/user/IUserOrder.repository";
import { IUserAddressRepository } from "../../core/interfaces/repositories/user/IUserAddress.repository";
import { ICartRepository } from "../../core/interfaces/repositories/user/ICart.repository";
import { IUserCouponRepository } from "../../core/interfaces/repositories/user/IUserCoupon.repository";
import { AdminCustomerListResponseDto, AdminCustomerDetailResponseDto } from "../../core/dtos/admin/adminCustomer.dto";
import { CustomError } from "../../utils/customError";
import { StatusCode } from "../../enums/statusCode.enums";

@injectable()
export class AdminCustomerService implements IAdminCustomerService {
    constructor(
        @inject(TYPES.IAdminCustomerRepository) private _adminCustomerRepository: IAdminCustomerRepository,
        @inject(TYPES.IUserOrderRepository) private _orderRepository: IUserOrderRepository,
        @inject(TYPES.IUserAddressRepository) private _addressRepository: IUserAddressRepository,
        @inject(TYPES.ICartRepository) private _cartRepository: ICartRepository,
        @inject(TYPES.IUserCouponRepository) private _couponRepository: IUserCouponRepository
    ) { }

    async getAllUsers(page: number, limit: number, search?: string, status?: string, sortBy?: string): Promise<AdminCustomerListResponseDto> {
        const skip = (page - 1) * limit;
        const { users, total } = await this._adminCustomerRepository.findAll(limit, skip, search, status, sortBy);

        return new AdminCustomerListResponseDto(users, total, page, limit);
    }

    async getUserById(id: string): Promise<AdminCustomerDetailResponseDto> {
        const user = await this._adminCustomerRepository.findById(id);
        if (!user) {
            throw new CustomError("User not found", StatusCode.NOT_FOUND);
        }

        const orders = await this._orderRepository.findByUserId(id);
        const addresses = await this._addressRepository.findAllByUserId(id);
        const cart = await this._cartRepository.findByUserId(id);

        // Coupon Logic
        const registrationDate = user.createdAt;
        const isNewUser = orders.length === 0;
        const availableCoupons = await this._couponRepository.getCouponsForUser(id, isNewUser, registrationDate);

        const usedCoupons = orders.filter((o: any) => o.discountCode).map((o: any) => ({
            code: o.discountCode,
            discountAmount: o.discountAmount,
            orderId: o._id,
            date: o.createdAt
        }));

        const stats = {
            totalOrders: orders.length,
            totalSpent: orders.reduce((sum: number, o: any) => sum + (o.finalAmount || 0), 0),
            avgOrderValue: orders.length > 0 ? (orders.reduce((sum: number, o: any) => sum + (o.finalAmount || 0), 0) / orders.length) : 0,
            lastOrderDate: orders.length > 0 ? orders[orders.length - 1].createdAt : null
        };

        return new AdminCustomerDetailResponseDto(user, orders, addresses, cart, { available: availableCoupons, used: usedCoupons }, stats);
    }

    async banUser(id: string): Promise<void> {
        const user = await this._adminCustomerRepository.findById(id);
        if (!user) {
            throw new CustomError("User not found", StatusCode.NOT_FOUND);
        }

        // Prevent banning other admins if we ever list them
        if (user.isAdmin) {
            throw new CustomError("Cannot ban an admin", StatusCode.FORBIDDEN);
        }

        await this._adminCustomerRepository.banUser(id);
    }

    async unbanUser(id: string): Promise<void> {
        const user = await this._adminCustomerRepository.findById(id);
        if (!user) {
            throw new CustomError("User not found", StatusCode.NOT_FOUND);
        }

        await this._adminCustomerRepository.unbanUser(id);
    }

    async getCustomerOrders(userId: string, page: number, limit: number): Promise<{ orders: any[], total: number, page: number, limit: number }> {
        const { orders, total } = await this._orderRepository.findByUserIdPaginated(userId, page, limit);
        return { orders, total, page, limit };
    }
}
