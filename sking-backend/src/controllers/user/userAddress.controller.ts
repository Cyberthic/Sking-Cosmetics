import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { TYPES } from "../../core/types";
import { IUserAddressController } from "../../core/interfaces/controllers/user/IUserAddress.controller";
import { IUserAddressService } from "../../core/interfaces/services/user/IUserAddress.service";
import { StatusCode } from "../../enums/statusCode.enums";
import logger from "../../utils/logger";
import { CustomError } from "../../utils/customError";

@injectable()
export class UserAddressController implements IUserAddressController {
    constructor(
        @inject(TYPES.IUserAddressService) private _userAddressService: IUserAddressService
    ) { }

    addAddress = async (req: Request, res: Response) => {
        try {
            // @ts-ignore
            const userId = req.user.id;
            const address = await this._userAddressService.addAddress(userId, req.body);
            res.status(StatusCode.CREATED).json({ success: true, data: address, message: "Address added successfully" });
        } catch (error: any) {
            logger.error("Add Address Error", error);
            const statusCode = error instanceof CustomError ? error.statusCode : StatusCode.INTERNAL_SERVER_ERROR;
            res.status(statusCode).json({ success: false, error: error.message || "Failed to add address" });
        }
    };

    updateAddress = async (req: Request, res: Response) => {
        try {
            // @ts-ignore
            const userId = req.user.id;
            const addressId = req.params.id;
            const address = await this._userAddressService.updateAddress(userId, addressId, req.body);
            res.status(StatusCode.OK).json({ success: true, data: address, message: "Address updated successfully" });
        } catch (error: any) {
            logger.error("Update Address Error", error);
            const statusCode = error instanceof CustomError ? error.statusCode : StatusCode.INTERNAL_SERVER_ERROR;
            res.status(statusCode).json({ success: false, error: error.message || "Failed to update address" });
        }
    };

    deleteAddress = async (req: Request, res: Response) => {
        try {
            // @ts-ignore
            const userId = req.user.id;
            const addressId = req.params.id;
            await this._userAddressService.deleteAddress(userId, addressId);
            res.status(StatusCode.OK).json({ success: true, message: "Address deleted successfully" });
        } catch (error: any) {
            logger.error("Delete Address Error", error);
            const statusCode = error instanceof CustomError ? error.statusCode : StatusCode.INTERNAL_SERVER_ERROR;
            res.status(statusCode).json({ success: false, error: error.message || "Failed to delete address" });
        }
    };

    getAllAddresses = async (req: Request, res: Response) => {
        try {
            // @ts-ignore
            const userId = req.user.id;
            const addresses = await this._userAddressService.getAllAddresses(userId);
            res.status(StatusCode.OK).json({ success: true, data: addresses });
        } catch (error: any) {
            logger.error("Get All Addresses Error", error);
            const statusCode = error instanceof CustomError ? error.statusCode : StatusCode.INTERNAL_SERVER_ERROR;
            res.status(statusCode).json({ success: false, error: error.message || "Failed to fetch addresses" });
        }
    };

    getAddress = async (req: Request, res: Response) => {
        try {
            // @ts-ignore
            const userId = req.user.id;
            const addressId = req.params.id;
            const address = await this._userAddressService.getAddress(userId, addressId);
            res.status(StatusCode.OK).json({ success: true, data: address });
        } catch (error: any) {
            logger.error("Get Address Error", error);
            const statusCode = error instanceof CustomError ? error.statusCode : StatusCode.INTERNAL_SERVER_ERROR;
            res.status(statusCode).json({ success: false, error: error.message || "Failed to fetch address" });
        }
    };

    setPrimaryAddress = async (req: Request, res: Response) => {
        try {
            // @ts-ignore
            const userId = req.user.id;
            const addressId = req.params.id;
            const address = await this._userAddressService.setPrimaryAddress(userId, addressId);
            res.status(StatusCode.OK).json({ success: true, data: address, message: "Address set as primary" });
        } catch (error: any) {
            logger.error("Set Primary Address Error", error);
            const statusCode = error instanceof CustomError ? error.statusCode : StatusCode.INTERNAL_SERVER_ERROR;
            res.status(statusCode).json({ success: false, error: error.message || "Failed to set primary address" });
        }
    };
}
