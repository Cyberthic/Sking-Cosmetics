import { Router } from "express";
import container from "../../core/inversify.config";
import { TYPES } from "../../core/types";
import { IAdminDashboardController } from "../../core/interfaces/controllers/admin/IAdminDashboard.controller";
import { isAuthenticated } from "../../middlewares/auth.middleware";

const dashboardRouter = Router();
const adminDashboardController = container.get<IAdminDashboardController>(TYPES.IAdminDashboardController);

dashboardRouter.get("/stats", isAuthenticated, adminDashboardController.getDashboardStats);

export default dashboardRouter;
