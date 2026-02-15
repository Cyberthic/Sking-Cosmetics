import { IFlashSale } from "../../../../models/flashSale.model";

export interface IFlashSaleService {
    getFlashSale(isAdmin?: boolean): Promise<any>;
    updateFlashSale(data: any): Promise<IFlashSale>;
}
