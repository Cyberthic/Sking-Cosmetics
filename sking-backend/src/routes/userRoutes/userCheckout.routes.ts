import { Router } from "express";
import { container } from "../../core/inversify.config";
import { TYPES } from "../../core/types";
import { IUserCheckoutController } from "../../core/interfaces/controllers/user/IUserCheckout.controller";
import { isAuthenticated } from "../../middlewares/auth.middleware";

const checkoutRouter = Router();
const checkoutController = container.get<IUserCheckoutController>(TYPES.IUserCheckoutController);

checkoutRouter.get("/settings", isAuthenticated, checkoutController.getDeliverySettings);
checkoutRouter.post("/place-order", isAuthenticated, checkoutController.placeOrder);

export default checkoutRouter;
