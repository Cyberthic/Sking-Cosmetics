import { injectable, inject } from "inversify";
import { TYPES } from "../../core/types";
import { IAdminCouponService } from "../../core/interfaces/services/admin/IAdminCoupon.service";
import { IAdminCouponRepository } from "../../core/interfaces/repositories/admin/IAdminCoupon.repository";
import { ICoupon } from "../../models/coupon.model";
import { CustomError } from "../../utils/customError";
import { StatusCode } from "../../enums/statusCode.enums";
import { IUserOrderRepository } from "../../core/interfaces/repositories/user/IUserOrder.repository";

import { IUserAuthRepository } from "../../core/interfaces/repositories/user/IUserAuth.repository";
import { IEmailService } from "../../core/interfaces/services/IEmail.service";
import logger from "../../utils/logger";

@injectable()
export class AdminCouponService implements IAdminCouponService {
    constructor(
        @inject(TYPES.IAdminCouponRepository) private _couponRepository: IAdminCouponRepository,
        @inject(TYPES.IUserOrderRepository) private _orderRepository: IUserOrderRepository,
        @inject(TYPES.IUserAuthRepository) private _userAuthRepository: IUserAuthRepository,
        @inject(TYPES.IEmailService) private _emailService: IEmailService
    ) { }

    async createCoupon(data: Partial<ICoupon>): Promise<ICoupon> {
        const existingCoupon = await this._couponRepository.findByCode(data.code!);
        if (existingCoupon) {
            throw new CustomError("Coupon code already exists", StatusCode.CONFLICT);
        }

        // Basic validation logic can be enhanced here or in middleware
        if (data.startDate && data.endDate && new Date(data.startDate) >= new Date(data.endDate)) {
            throw new CustomError("Start date must be before end date", StatusCode.BAD_REQUEST);
        }

        const coupon = await this._couponRepository.create(data);

        // Send New Offer Email to all users (Fire and Forget)
        this._sendNewOfferEmail(coupon).catch(err => logger.error("Failed to send new offer emails", err));

        return coupon;
    }

    private async _sendNewOfferEmail(coupon: ICoupon): Promise<void> {
        try {
            // Fetch all users with only email field
            const users = await this._userAuthRepository.find({}, { email: 1 });
            if (!users || users.length === 0) return;

            const emailPromises = users.map(user => {
                if (user.email) {
                    return this._emailService.sendNewOfferEmail(user.email, coupon)
                        .catch(e => logger.error(`Failed to send offer email to ${user.email}`, e));
                }
                return Promise.resolve();
            });

            await Promise.all(emailPromises);
            logger.info(`New offer emails sent for coupon: ${coupon.code}`);
        } catch (error) {
            logger.error("Error in _sendNewOfferEmail", error);
        }
    }

    async getCoupons(limit: number, page: number, search?: string, status?: string, sort?: string): Promise<{ coupons: ICoupon[]; total: number; totalPages: number }> {
        const skip = (page - 1) * limit;
        const { coupons, total } = await this._couponRepository.findAll(limit, skip, search, status, sort);

        return {
            coupons,
            total,
            totalPages: Math.ceil(total / limit)
        };
    }

    async getCouponById(id: string): Promise<ICoupon | null> {
        const coupon = await this._couponRepository.findById(id);
        if (!coupon) {
            throw new CustomError("Coupon not found", StatusCode.NOT_FOUND);
        }
        return coupon;
    }

    async updateCoupon(id: string, data: Partial<ICoupon>): Promise<ICoupon | null> {
        // Ensure code uniqueness if code is being updated
        if (data.code) {
            const existingCoupon = await this._couponRepository.findByCode(data.code);
            if (existingCoupon && existingCoupon._id.toString() !== id) {
                throw new CustomError("Coupon code already exists", StatusCode.CONFLICT);
            }
        }

        const coupon = await this._couponRepository.update(id, data);
        if (!coupon) {
            throw new CustomError("Coupon not found", StatusCode.NOT_FOUND);
        }
        return coupon;
    }

    async deleteCoupon(id: string): Promise<boolean> {
        const deleted = await this._couponRepository.delete(id);
        if (!deleted) {
            throw new CustomError("Coupon not found", StatusCode.NOT_FOUND);
        }
        return true;
    }

    async getCouponStats(id: string): Promise<any> {
        return await this._orderRepository.findStatsByCouponId(id);
    }

    async getCouponOrders(id: string, page: number, limit: number): Promise<{ orders: any[], total: number }> {
        return await this._orderRepository.findByCouponIdPaginated(id, page, limit);
    }
}
