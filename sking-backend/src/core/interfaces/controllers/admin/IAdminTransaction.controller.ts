import { Request, Response } from "express";

export interface IAdminTransactionController {
    getTransactions(req: Request, res: Response): Promise<Response>;
    getTransactionById(req: Request, res: Response): Promise<Response>;
}
