import { ICoupon } from "../../../../models/coupon.model";

export interface IUserCouponRepository {
    getCouponsForUser(userId: string, isNewUser: boolean, registrationDate: Date): Promise<ICoupon[]>;
}
