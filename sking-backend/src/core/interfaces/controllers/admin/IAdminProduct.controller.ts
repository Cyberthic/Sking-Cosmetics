import { Request, Response } from "express";

export interface IAdminProductController {
    createProduct(req: Request, res: Response): Promise<Response>;
    getProducts(req: Request, res: Response): Promise<Response>;
    getProductById(req: Request, res: Response): Promise<Response>;
    updateProduct(req: Request, res: Response): Promise<Response>;
    deleteProduct(req: Request, res: Response): Promise<Response>;
    uploadImage(req: Request, res: Response): Promise<Response>;
}
