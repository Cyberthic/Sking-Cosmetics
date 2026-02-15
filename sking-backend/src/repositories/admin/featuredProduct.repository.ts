import { injectable } from "inversify";
import { IFeaturedProductRepository } from "../../core/interfaces/repositories/admin/IFeaturedProduct.repository";
import { FeaturedProductModel, IFeaturedProduct } from "../../models/featuredProduct.model";

@injectable()
export class FeaturedProductRepository implements IFeaturedProductRepository {
    async getFeaturedProduct(): Promise<IFeaturedProduct | null> {
        return await FeaturedProductModel.findOne().populate("products");
    }

    async updateFeaturedProduct(data: any): Promise<IFeaturedProduct | null> {
        return await FeaturedProductModel.findOneAndUpdate(
            {},
            data,
            { upsert: true, new: true }
        ).populate("products");
    }
}
