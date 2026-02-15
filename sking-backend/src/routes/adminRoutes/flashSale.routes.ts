import { Router } from "express";
import container from "../../core/inversify.config";
import { TYPES } from "../../core/types";
import { IFlashSaleController } from "../../core/interfaces/controllers/admin/IFlashSale.controller";
import { isAuthenticated } from "../../middlewares/auth.middleware";

const router = Router();
const controller = container.get<IFlashSaleController>(TYPES.IFlashSaleController);

router.get("/", isAuthenticated, controller.getFlashSale);
router.put("/", isAuthenticated, controller.updateFlashSale);

export default router;
