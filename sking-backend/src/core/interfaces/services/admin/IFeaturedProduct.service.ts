import { IFeaturedProduct } from "../../../../models/featuredProduct.model";

export interface IFeaturedProductService {
    getFeaturedProduct(): Promise<any>;
    updateFeaturedProduct(data: any): Promise<IFeaturedProduct>;
}
