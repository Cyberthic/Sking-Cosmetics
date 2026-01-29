import Coupon, { ICoupon } from "../../models/coupon.model";
import { IUserCouponRepository } from "../../core/interfaces/repositories/user/IUserCoupon.repository";

import { injectable } from "inversify";

@injectable()
export class UserCouponRepository implements IUserCouponRepository {
    async getCouponsForUser(userId: string, isNewUser: boolean, registrationDate: Date): Promise<ICoupon[]> {
        const now = new Date();

        // Base criteria for active/visible coupons
        // We fetch even recently ended coupons if we want to show "Ended" category?
        // Let's fetch all coupons that are isActive: true and let the service handle categorization.

        const coupons = await Coupon.find({
            isActive: true,
            $or: [
                { couponType: 'all' },
                { couponType: 'new_users', _id: { $exists: isNewUser } }, // Simple check, better handled in code
                { couponType: 'specific_users', specificUsers: userId },
                { couponType: 'registered_after', registeredAfter: { $lte: registrationDate } }
            ]
        }).sort({ createdAt: -1 });

        // Filter more accurately in JS since some logic like "new_users" depends on external state (orders)
        return coupons.filter(coupon => {
            if (coupon.couponType === 'new_users' && !isNewUser) return false;
            if (coupon.couponType === 'registered_after' && registrationDate < coupon.registeredAfter!) return false;
            return true;
        });
    }
}
