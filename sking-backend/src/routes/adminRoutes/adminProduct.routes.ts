import { Router } from "express";
import container from "../../core/inversify.config";
import { TYPES } from "../../core/types";
import { IAdminProductController } from "../../core/interfaces/controllers/admin/IAdminProduct.controller";
import { isAuthenticated } from "../../middlewares/auth.middleware";
import multer from "multer";

const productRouter = Router();
const adminProductController = container.get<IAdminProductController>(TYPES.IAdminProductController);

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

productRouter.post("/", isAuthenticated, adminProductController.createProduct);
productRouter.post("/upload-image", isAuthenticated, upload.single("image"), adminProductController.uploadImage);
productRouter.get("/", isAuthenticated, adminProductController.getProducts);
productRouter.get("/:id", isAuthenticated, adminProductController.getProductById);
productRouter.put("/:id", isAuthenticated, adminProductController.updateProduct);
productRouter.patch("/:id/toggle-status", isAuthenticated, adminProductController.toggleProductStatus);

export default productRouter;
