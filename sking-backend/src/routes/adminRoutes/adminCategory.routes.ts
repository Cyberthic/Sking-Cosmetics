import { Router } from "express";
import container from "../../core/inversify.config";
import { TYPES } from "../../core/types";
import { IAdminCategoryController } from "../../core/interfaces/controllers/admin/IAdminCategory.controller";
import { verifyToken } from "../../middlewares/auth.middleware";

const categoryRouter = Router();
const adminCategoryController = container.get<IAdminCategoryController>(TYPES.IAdminCategoryController);

categoryRouter.post("/", verifyToken, adminCategoryController.createCategory);
categoryRouter.get("/", verifyToken, adminCategoryController.getCategories);
categoryRouter.get("/:id", verifyToken, adminCategoryController.getCategoryById);
categoryRouter.put("/:id", verifyToken, adminCategoryController.updateCategory);
categoryRouter.delete("/:id", verifyToken, adminCategoryController.deleteCategory);

export default categoryRouter;
