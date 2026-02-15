import { Router } from "express";
import { container } from "../../core/inversify.config";
import { TYPES } from "../../core/types";
import { IAdminOrderController } from "../../core/interfaces/controllers/admin/IAdminOrder.controller";

const adminOrderRouter = Router();
const _orderController = container.get<IAdminOrderController>(TYPES.IAdminOrderController);

adminOrderRouter.get("/", _orderController.getOrders);
adminOrderRouter.get("/:id", _orderController.getOrderById);
adminOrderRouter.patch("/:id/status", _orderController.updateOrderStatus);
adminOrderRouter.post("/:id/confirm-payment", _orderController.confirmManualPayment);

export default adminOrderRouter;
