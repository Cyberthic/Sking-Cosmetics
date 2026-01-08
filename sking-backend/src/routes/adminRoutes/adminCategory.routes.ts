import { Router } from "express";
import container from "../../core/inversify.config";
import { TYPES } from "../../core/types";
import { IAdminCategoryController } from "../../core/interfaces/controllers/admin/IAdminCategory.controller";
import { isAuthenticated } from "../../middlewares/auth.middleware";

const categoryRouter = Router();
const adminCategoryController = container.get<IAdminCategoryController>(TYPES.IAdminCategoryController);

categoryRouter.post("/", isAuthenticated, adminCategoryController.createCategory);
categoryRouter.get("/", isAuthenticated, adminCategoryController.getCategories);
categoryRouter.get("/:id", isAuthenticated, adminCategoryController.getCategoryById);
categoryRouter.put("/:id", isAuthenticated, adminCategoryController.updateCategory);
categoryRouter.delete("/:id", isAuthenticated, adminCategoryController.deleteCategory);

export default categoryRouter;
