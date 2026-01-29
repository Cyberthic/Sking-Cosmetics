import { Router } from "express";
import { container } from "../../core/inversify.config";
import { TYPES } from "../../core/types";
import { IAdminCouponController } from "../../core/interfaces/controllers/admin/IAdminCoupon.controller";
import { adminAuthMiddleware } from "../../middlewares/adminAuth.middleware";

const router = Router();
const adminCouponController = container.get<IAdminCouponController>(TYPES.IAdminCouponController);

router.use(adminAuthMiddleware);

router.post("/", (req, res) => adminCouponController.createCoupon(req, res));
router.get("/", (req, res) => adminCouponController.getCoupons(req, res));
router.get("/:id", (req, res) => adminCouponController.getCouponById(req, res));
router.put("/:id", (req, res) => adminCouponController.updateCoupon(req, res));
router.delete("/:id", (req, res) => adminCouponController.deleteCoupon(req, res));
router.get("/:id/orders", (req, res) => adminCouponController.getCouponOrders(req, res));
router.get("/:id/stats", (req, res) => adminCouponController.getCouponStats(req, res));

export default router;
