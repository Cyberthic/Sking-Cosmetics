import { injectable } from "inversify";
import { IFlashSaleRepository } from "../../core/interfaces/repositories/admin/IFlashSale.repository";
import { FlashSaleModel, IFlashSale } from "../../models/flashSale.model";

@injectable()
export class FlashSaleRepository implements IFlashSaleRepository {
    async getFlashSale(): Promise<IFlashSale | null> {
        return await FlashSaleModel.findOne().populate("products");
    }

    async updateFlashSale(data: any): Promise<IFlashSale | null> {
        return await FlashSaleModel.findOneAndUpdate(
            {},
            data,
            { upsert: true, new: true }
        ).populate("products");
    }
}
