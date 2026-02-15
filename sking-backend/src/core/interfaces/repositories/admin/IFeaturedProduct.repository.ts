import { IFeaturedProduct } from "../../../../models/featuredProduct.model";

export interface IFeaturedProductRepository {
    getFeaturedProduct(): Promise<IFeaturedProduct | null>;
    updateFeaturedProduct(data: any): Promise<IFeaturedProduct>;
}
