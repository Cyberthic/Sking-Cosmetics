import { Request, Response } from "express";

export interface IAdminProductController {
    createProduct(req: Request, res: Response): Promise<Response>;
    getProducts(req: Request, res: Response): Promise<Response>;
    getProductById(req: Request, res: Response): Promise<Response>;
    updateProduct(req: Request, res: Response): Promise<Response>;
    toggleProductStatus(req: Request, res: Response): Promise<Response>;
    uploadImage(req: Request, res: Response): Promise<Response>;
    getProductOrders(req: Request, res: Response): Promise<Response>;
    getProductStats(req: Request, res: Response): Promise<Response>;
}
