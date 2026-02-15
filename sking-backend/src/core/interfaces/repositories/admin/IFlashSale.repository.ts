import { IFlashSale } from "../../../../models/flashSale.model";

export interface IFlashSaleRepository {
    getFlashSale(): Promise<IFlashSale | null>;
    updateFlashSale(data: any): Promise<IFlashSale>;
}
