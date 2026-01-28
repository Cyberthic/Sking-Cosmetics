import { Router } from "express";
import { container } from "../../core/inversify.config";
import { TYPES } from "../../core/types";
import { IUserOrderController } from "../../core/interfaces/controllers/user/IUserOrder.controller";
import { isAuthenticated } from "../../middlewares/auth.middleware";

const userOrderRouter = Router();
const userOrderController = container.get<IUserOrderController>(TYPES.IUserOrderController);

userOrderRouter.get("/", isAuthenticated, userOrderController.getUserOrders);
userOrderRouter.get("/:orderId", isAuthenticated, userOrderController.getOrderDetail);
userOrderRouter.post("/verify-payment", isAuthenticated, userOrderController.verifyPayment);
userOrderRouter.post("/retry-payment/:orderId", isAuthenticated, userOrderController.retryPayment);
userOrderRouter.post("/webhook", userOrderController.handleWebhook);

export default userOrderRouter;
