import { Router } from "express";
import container from "../../core/inversify.config";
import { TYPES } from "../../core/types";
import { UserCartController } from "../../controllers/user/userCart.controller";
import { isAuthenticated } from "../../middlewares/auth.middleware";

const userCartRouter = Router();
const cartController = container.get<UserCartController>(TYPES.IUserCartController);

userCartRouter.use(isAuthenticated);
userCartRouter.get("/", cartController.getCart.bind(cartController));
userCartRouter.post("/add", cartController.addToCart.bind(cartController));
userCartRouter.put("/update", cartController.updateQuantity.bind(cartController));
userCartRouter.delete("/remove", cartController.removeFromCart.bind(cartController));

export default userCartRouter;
