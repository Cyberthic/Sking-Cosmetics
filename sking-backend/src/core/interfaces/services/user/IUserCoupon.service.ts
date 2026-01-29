import { ICoupon } from "../../../../models/coupon.model";

export interface IUserCouponService {
    getMyCoupons(userId: string): Promise<{ active: ICoupon[], ended: ICoupon[] }>;
    applyCoupon(userId: string, code: string, cartTotal: number, cartItems: any[]): Promise<{ discountAmount: number, coupon: ICoupon, finalTotal: number }>;
    markCouponUsed(code: string, userId: string): Promise<void>;
}
