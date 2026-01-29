import { injectable, inject } from "inversify";
import Coupon, { ICoupon } from "../../models/coupon.model";
import { IAdminCouponRepository } from "../../core/interfaces/repositories/admin/IAdminCoupon.repository";

@injectable()
export class AdminCouponRepository implements IAdminCouponRepository {
    async create(data: Partial<ICoupon>): Promise<ICoupon> {
        return await Coupon.create(data);
    }

    async findAll(limit: number, skip: number, search?: string, status?: string, sort?: string): Promise<{ coupons: ICoupon[]; total: number }> {
        let query: any = {};

        if (search) {
            query.code = { $regex: search, $options: "i" };
        }

        if (status) {
            const now = new Date();
            if (status === 'active') {
                query.isActive = true;
                query.startDate = { $lte: now };
                query.endDate = { $gte: now };
            } else if (status === 'ended') {
                query.$or = [
                    { isActive: false },
                    { endDate: { $lt: now } }
                ];
            } else if (status === 'upcoming') {
                query.isActive = true;
                query.startDate = { $gt: now };
            }
        }

        let sortOptions: any = { createdAt: -1 };
        if (sort) {
            const [field, order] = sort.split(':');
            sortOptions = { [field]: order === 'desc' ? -1 : 1 };
        }

        const total = await Coupon.countDocuments(query);
        const coupons = await Coupon.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(limit)
            .populate('specificUsers', 'name email')
            .populate('specificProducts', 'name images');

        return { coupons, total };
    }

    async findById(id: string): Promise<ICoupon | null> {
        return await Coupon.findById(id)
            .populate('specificUsers', 'name email')
            .populate('specificProducts', 'name images');
    }

    async findByCode(code: string): Promise<ICoupon | null> {
        return await Coupon.findOne({ code: code.toUpperCase() });
    }

    async update(id: string, data: Partial<ICoupon>): Promise<ICoupon | null> {
        return await Coupon.findByIdAndUpdate(id, data, { new: true })
            .populate('specificUsers', 'name email')
            .populate('specificProducts', 'name images');
    }

    async delete(id: string): Promise<boolean> {
        const result = await Coupon.findByIdAndDelete(id);
        return !!result;
    }
}
