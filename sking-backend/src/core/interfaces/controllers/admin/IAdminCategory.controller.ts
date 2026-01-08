import { Request, Response } from "express";

export interface IAdminCategoryController {
    createCategory(req: Request, res: Response): Promise<Response>;
    getCategories(req: Request, res: Response): Promise<Response>;
    getCategoryById(req: Request, res: Response): Promise<Response>;
    updateCategory(req: Request, res: Response): Promise<Response>;
    deleteCategory(req: Request, res: Response): Promise<Response>;
}
