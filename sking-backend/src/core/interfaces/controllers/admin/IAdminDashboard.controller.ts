import type { Request, Response } from "express";

export interface IAdminDashboardController {
    getDashboardStats(req: Request, res: Response): Promise<void>;
    updateMonthlyTarget(req: Request, res: Response): Promise<void>;
}
