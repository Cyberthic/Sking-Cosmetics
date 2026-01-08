import { Router } from "express";
import container from "../../core/inversify.config";
import { TYPES } from "../../core/types";
import { UserProductController } from "../../controllers/user/userProduct.controller";

const userProductRouter = Router();

const productController = container.get<UserProductController>(TYPES.IUserProductController);

userProductRouter.get("/", productController.getProducts.bind(productController));
userProductRouter.get("/:id", productController.getProductById.bind(productController));

export default userProductRouter;
