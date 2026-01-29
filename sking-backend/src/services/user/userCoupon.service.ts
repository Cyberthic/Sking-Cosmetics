import { IUserCouponService } from "../../core/interfaces/services/user/IUserCoupon.service";
import { IUserCouponRepository } from "../../core/interfaces/repositories/user/IUserCoupon.repository";
import { IUserOrderRepository } from "../../core/interfaces/repositories/user/IUserOrder.repository";
import { ICoupon } from "../../models/coupon.model";
import { UserModel } from "../../models/user.model";

import { injectable, inject } from "inversify";
import { TYPES } from "../../core/types";

@injectable()
export class UserCouponService implements IUserCouponService {
    constructor(
        @inject(TYPES.IUserCouponRepository) private userCouponRepository: IUserCouponRepository,
        @inject(TYPES.IUserOrderRepository) private userOrderRepository: IUserOrderRepository
    ) { }

    async getMyCoupons(userId: string): Promise<{ active: ICoupon[], ended: ICoupon[] }> {
        const user = await UserModel.findById(userId);
        if (!user) throw new Error("User not found");

        const userOrders = await this.userOrderRepository.findByUserId(userId);
        const isNewUser = userOrders.length === 0;
        const registrationDate = user.createdAt;

        const allCoupons = await this.userCouponRepository.getCouponsForUser(userId, isNewUser, registrationDate);

        const now = new Date();
        const active: ICoupon[] = [];
        const ended: ICoupon[] = [];

        allCoupons.forEach(coupon => {
            const hasEnded = new Date(coupon.endDate) < now || !coupon.isActive || (coupon.usageLimit > 0 && coupon.usageCount >= coupon.usageLimit);
            if (hasEnded) {
                ended.push(coupon);
            } else {
                active.push(coupon);
            }
        });

        return { active, ended };
    }
}
