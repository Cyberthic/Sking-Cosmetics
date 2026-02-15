
import { Router } from "express";
import { container } from "../../core/inversify.config";
import { TYPES } from "../../core/types";
import { IAdminDeliveryController } from "../../core/interfaces/controllers/admin/IAdminDelivery.controller";
import { adminAuthMiddleware } from "../../middlewares/adminAuth.middleware";
import { errorHandler } from "../../middlewares/error.middleware";

const router = Router();
const deliveryController = container.get<IAdminDeliveryController>(TYPES.IAdminDeliveryController);

// Log to confirm routes are loading
console.log("Loading Admin Delivery Routes...");

router.get("/", adminAuthMiddleware, (req, res, next) => deliveryController.getDeliverySettings(req, res).catch(next));
router.put("/", adminAuthMiddleware, (req, res, next) => deliveryController.updateDeliverySettings(req, res).catch(next));

router.use(errorHandler);

export default router;
