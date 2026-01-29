import { ICoupon } from "../../../../models/coupon.model";

export interface IUserCouponService {
    getMyCoupons(userId: string): Promise<{ active: ICoupon[], ended: ICoupon[] }>;
}
