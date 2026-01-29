import { Router } from "express";
import { container } from "../../core/inversify.config";
import { TYPES } from "../../core/types";
import { IUserCouponController } from "../../core/interfaces/controllers/user/IUserCoupon.controller";
import { isAuthenticated } from "../../middlewares/auth.middleware";

const userCouponRouter = Router();
const userCouponController = container.get<IUserCouponController>(TYPES.IUserCouponController);

userCouponRouter.get("/", isAuthenticated, userCouponController.getMyCoupons);

export default userCouponRouter;
