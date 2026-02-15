import { Request, Response } from "express";

export interface IOrderSettingsController {
    getSettings(req: Request, res: Response): Promise<void>;
    updateSettings(req: Request, res: Response): Promise<void>;
}
