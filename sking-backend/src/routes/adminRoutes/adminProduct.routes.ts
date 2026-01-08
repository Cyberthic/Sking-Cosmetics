import { Router } from "express";
import container from "../../core/inversify.config";
import { TYPES } from "../../core/types";
import { IAdminProductController } from "../../core/interfaces/controllers/admin/IAdminProduct.controller";
import { verifyToken } from "../../middlewares/auth.middleware";
import multer from "multer";

const productRouter = Router();
const adminProductController = container.get<IAdminProductController>(TYPES.IAdminProductController);

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

productRouter.post("/", verifyToken, adminProductController.createProduct);
productRouter.post("/upload-image", verifyToken, upload.single("image"), adminProductController.uploadImage);
productRouter.get("/", verifyToken, adminProductController.getProducts);
productRouter.get("/:id", verifyToken, adminProductController.getProductById);
productRouter.put("/:id", verifyToken, adminProductController.updateProduct);
productRouter.delete("/:id", verifyToken, adminProductController.deleteProduct);

export default productRouter;
