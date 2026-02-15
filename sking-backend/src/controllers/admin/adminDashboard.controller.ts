import { inject, injectable } from "inversify";
import { TYPES } from "../../core/types";
import type { Request, Response } from "express";
import { IAdminDashboardController } from "../../core/interfaces/controllers/admin/IAdminDashboard.controller";
import { IAdminDashboardService, DashboardPeriod } from "../../core/interfaces/services/admin/IAdminDashboard.service";

@injectable()
export class AdminDashboardController implements IAdminDashboardController {
    constructor(
        @inject(TYPES.IAdminDashboardService) private _adminDashboardService: IAdminDashboardService
    ) { }

    async getDashboardStats(req: Request, res: Response): Promise<void> {
        try {
            const customerPeriod = (req.query.customerPeriod as DashboardPeriod) || 'weekly';
            const orderPeriod = (req.query.orderPeriod as DashboardPeriod) || 'weekly';

            let startDate: Date | undefined;
            let endDate: Date | undefined;

            if (req.query.startDate) {
                startDate = new Date(req.query.startDate as string);
            }
            if (req.query.endDate) {
                endDate = new Date(req.query.endDate as string);
            }

            const stats = await this._adminDashboardService.getDashboardStats(
                customerPeriod,
                orderPeriod,
                startDate,
                endDate
            );

            res.status(200).json({
                success: true,
                data: stats
            });
        } catch (error: any) {
            console.error("Dashboard Stats Error:", error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async updateMonthlyTarget(req: Request, res: Response): Promise<void> {
        try {
            const { target } = req.body;

            if (target === undefined || target === null) {
                res.status(400).json({
                    success: false,
                    message: "Target value is required"
                });
                return;
            }

            await this._adminDashboardService.updateMonthlyTarget(Number(target));

            res.status(200).json({
                success: true,
                message: "Monthly target updated successfully"
            });
        } catch (error: any) {
            console.error("Update Target Error:", error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}
