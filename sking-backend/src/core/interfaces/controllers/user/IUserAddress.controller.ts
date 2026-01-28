import { Request, Response } from "express";

export interface IUserAddressController {
    addAddress(req: Request, res: Response): Promise<void>;
    updateAddress(req: Request, res: Response): Promise<void>;
    deleteAddress(req: Request, res: Response): Promise<void>;
    getAllAddresses(req: Request, res: Response): Promise<void>;
    getAddress(req: Request, res: Response): Promise<void>;
    setPrimaryAddress(req: Request, res: Response): Promise<void>;
}
