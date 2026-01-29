import { ICoupon } from "../../../../models/coupon.model";

export interface IAdminCouponRepository {
    create(data: Partial<ICoupon>): Promise<ICoupon>;
    findAll(limit: number, skip: number, search?: string, status?: string, sort?: string): Promise<{ coupons: ICoupon[]; total: number }>;
    findById(id: string): Promise<ICoupon | null>;
    findByCode(code: string): Promise<ICoupon | null>;
    update(id: string, data: Partial<ICoupon>): Promise<ICoupon | null>;
    delete(id: string): Promise<boolean>;
}
