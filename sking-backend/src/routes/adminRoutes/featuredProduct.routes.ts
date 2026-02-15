import { Router } from "express";
import container from "../../core/inversify.config";
import { TYPES } from "../../core/types";
import { IFeaturedProductController } from "../../core/interfaces/controllers/admin/IFeaturedProduct.controller";
import { isAuthenticated } from "../../middlewares/auth.middleware";

const router = Router();
const controller = container.get<IFeaturedProductController>(TYPES.IFeaturedProductController);

router.get("/", isAuthenticated, controller.getFeaturedProduct);
router.put("/", isAuthenticated, controller.updateFeaturedProduct);

export default router;
