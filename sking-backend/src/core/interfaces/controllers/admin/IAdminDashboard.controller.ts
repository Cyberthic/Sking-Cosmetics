import type { Request, Response } from "express";

export interface IAdminDashboardController {
    getDashboardStats(req: Request, res: Response): Promise<void>;
    updateMonthlyTarget(req: Request, res: Response): Promise<void>;
    getSummaryStats(req: Request, res: Response): Promise<void>;
    getSalesChart(req: Request, res: Response): Promise<void>;
    getCustomerPerformance(req: Request, res: Response): Promise<void>;
    getRecentOrders(req: Request, res: Response): Promise<void>;
    getDemographics(req: Request, res: Response): Promise<void>;
    getMonthlyTarget(req: Request, res: Response): Promise<void>;
}
