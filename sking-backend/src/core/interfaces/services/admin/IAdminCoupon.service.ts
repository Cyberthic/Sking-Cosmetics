import { ICoupon } from "../../../../models/coupon.model";

export interface IAdminCouponService {
    createCoupon(data: Partial<ICoupon>): Promise<ICoupon>;
    getCoupons(limit: number, page: number, search?: string, status?: string, sort?: string): Promise<{ coupons: ICoupon[]; total: number; totalPages: number }>;
    getCouponById(id: string): Promise<ICoupon | null>;
    updateCoupon(id: string, data: Partial<ICoupon>): Promise<ICoupon | null>;
    deleteCoupon(id: string): Promise<boolean>;
}
