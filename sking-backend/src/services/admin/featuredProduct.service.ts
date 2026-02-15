import { inject, injectable } from "inversify";
import { TYPES } from "../../core/types";
import { IFeaturedProductService } from "../../core/interfaces/services/admin/IFeaturedProduct.service";
import { IFeaturedProductRepository } from "../../core/interfaces/repositories/admin/IFeaturedProduct.repository";
import { IFeaturedProduct } from "../../models/featuredProduct.model";

@injectable()
export class FeaturedProductService implements IFeaturedProductService {
    constructor(
        @inject(TYPES.IFeaturedProductRepository) private _repository: IFeaturedProductRepository
    ) { }

    async getFeaturedProduct(): Promise<any> {
        return await this._repository.getFeaturedProduct();
    }

    async updateFeaturedProduct(data: any): Promise<IFeaturedProduct> {
        return await this._repository.updateFeaturedProduct(data);
    }
}
