import { Router } from "express";
import container from "../../core/inversify.config";
import { TYPES } from "../../core/types";
import { IAdminDashboardController } from "../../core/interfaces/controllers/admin/IAdminDashboard.controller";
import { isAuthenticated } from "../../middlewares/auth.middleware";

const dashboardRouter = Router();
const adminDashboardController = container.get<IAdminDashboardController>(TYPES.IAdminDashboardController);

dashboardRouter.get("/stats", isAuthenticated, adminDashboardController.getDashboardStats.bind(adminDashboardController));
dashboardRouter.get("/summary", isAuthenticated, adminDashboardController.getSummaryStats.bind(adminDashboardController));
dashboardRouter.get("/sales-chart", isAuthenticated, adminDashboardController.getSalesChart.bind(adminDashboardController));
dashboardRouter.get("/customer-performance", isAuthenticated, adminDashboardController.getCustomerPerformance.bind(adminDashboardController));
dashboardRouter.get("/recent-orders", isAuthenticated, adminDashboardController.getRecentOrders.bind(adminDashboardController));
dashboardRouter.get("/demographics", isAuthenticated, adminDashboardController.getDemographics.bind(adminDashboardController));
dashboardRouter.get("/monthly-target", isAuthenticated, adminDashboardController.getMonthlyTarget.bind(adminDashboardController));
dashboardRouter.put("/target", isAuthenticated, adminDashboardController.updateMonthlyTarget.bind(adminDashboardController));

export default dashboardRouter;
