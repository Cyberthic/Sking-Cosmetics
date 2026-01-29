import { IUserCouponService } from "../../core/interfaces/services/user/IUserCoupon.service";
import { IUserCouponRepository } from "../../core/interfaces/repositories/user/IUserCoupon.repository";
import { IUserOrderRepository } from "../../core/interfaces/repositories/user/IUserOrder.repository";
import { ICoupon } from "../../models/coupon.model";
import { UserModel } from "../../models/user.model";
import { CustomError } from "../../utils/customError";
import { StatusCode } from "../../enums/statusCode.enums";

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
        if (!user) throw new CustomError("User not found", StatusCode.NOT_FOUND);

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

    async applyCoupon(userId: string, code: string, cartTotal: number, cartItems: any[]): Promise<{ discountAmount: number, coupon: ICoupon, finalTotal: number }> {
        // 1. Fetch Coupon
        // Direct model access for simplicity, or we should add findByCode in Repo. 
        // Using Model directly as it's active record pattern in mongoose often used here for speed.
        const coupon = await import("../../models/coupon.model").then(m => m.default.findOne({ code: code, isActive: true }).populate('specificProducts'));

        if (!coupon) {
            throw new CustomError("Invalid or inactive coupon code", StatusCode.NOT_FOUND);
        }

        // 2. Basic Validations
        const now = new Date();
        if (new Date(coupon.startDate) > now) throw new CustomError("Coupon is not yet active", StatusCode.BAD_REQUEST);
        if (new Date(coupon.endDate) < now) throw new CustomError("Coupon has expired", StatusCode.BAD_REQUEST);
        if (coupon.usageLimit > 0 && coupon.usageCount >= coupon.usageLimit) throw new CustomError("Coupon usage limit reached", StatusCode.BAD_REQUEST);
        if (cartTotal < coupon.minOrderAmount) throw new CustomError(`Minimum order amount of ₹${coupon.minOrderAmount} required`, StatusCode.BAD_REQUEST);

        // 3. User Specific Validations
        const user = await UserModel.findById(userId);
        const userOrders = await this.userOrderRepository.findByUserId(userId);

        // Check per-user limit
        const userUsageCount = userOrders.filter(o => o.coupon && o.coupon.toString() === coupon._id.toString()).length;
        if (coupon.userLimit > 0 && userUsageCount >= coupon.userLimit) {
            throw new CustomError("You have already used this coupon the maximum number of times", StatusCode.BAD_REQUEST);
        }

        // Targeting Rules
        if (coupon.couponType === 'new_users' && userOrders.length > 0) throw new CustomError("This coupon is for new users only", StatusCode.BAD_REQUEST);

        if (coupon.couponType === 'registered_after' && coupon.registeredAfter) {
            if (user && user.createdAt < coupon.registeredAfter) throw new CustomError("This coupon is not valid for your account", StatusCode.BAD_REQUEST);
        }

        if (coupon.couponType === 'specific_users') {
            const isSpecific = coupon.specificUsers?.some((id: any) => id.toString() === userId);
            if (!isSpecific) throw new CustomError("This coupon is not valid for your account", StatusCode.FORBIDDEN);
        }

        // 4. Calculate Discount
        let applicableAmount = cartTotal;

        if (coupon.couponType === 'specific_products' && coupon.specificProducts && coupon.specificProducts.length > 0) {
            // Filter cart items that match specific products
            // Assuming cartItems have product populated or product id
            const validProductIds = coupon.specificProducts.map((p: any) => p._id.toString());
            const matchingItems = cartItems.filter(item => {
                const itemId = item.product._id ? item.product._id.toString() : item.product.toString();
                return validProductIds.includes(itemId);
            });

            if (matchingItems.length === 0) {
                throw new CustomError("Coupon is not applicable to any items in your cart", StatusCode.BAD_REQUEST);
            }

            // Sum up the price of matching items
            applicableAmount = matchingItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        }

        let discount = 0;
        if (coupon.discountType === 'percentage') {
            discount = (applicableAmount * coupon.discountValue) / 100;
        } else {
            discount = coupon.discountValue;
        }

        // Apply Max Discount Cap
        const maxDiscount = coupon.maxDiscountAmount || 0;
        if (maxDiscount > 0 && discount > maxDiscount) {
            discount = maxDiscount;
        }

        // Ensure discount doesn't exceed total (though logic above usually handles it, safety check)
        if (discount > cartTotal) {
            discount = cartTotal;
        }

        return {
            discountAmount: Math.round(discount), // Round for currency
            coupon: coupon,
            finalTotal: Math.round(cartTotal - discount)
        };
    }

    async markCouponUsed(code: string, userId: string, session?: any): Promise<void> {
        const couponModel = await import("../../models/coupon.model").then(m => m.default);
        await couponModel.findOneAndUpdate(
            { code: code },
            { $inc: { usageCount: 1 } },
            { session }
        );
    }
}
