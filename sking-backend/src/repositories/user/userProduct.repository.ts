import { injectable } from "inversify";
import { BaseRepository } from "../base.repository";
import { IUserProductRepository } from "../../core/interfaces/repositories/user/IUserProduct.repository";
import { IProduct, ProductModel } from "../../models/product.model";

@injectable()
export class UserProductRepository extends BaseRepository<IProduct> implements IUserProductRepository {
    constructor() {
        super(ProductModel);
    }

    async findActive(filter: any, sort: any, skip: number, limit: number): Promise<IProduct[]> {
        return this._model
            .find({ ...filter, isActive: true })
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .populate('category')
            .exec();
    }

    async countActive(filter: any): Promise<number> {
        return this._model.countDocuments({ ...filter, isActive: true }).exec();
    }

    async findNewArrivals(limit: number): Promise<IProduct[]> {
        return this._model
            .find({ isActive: true })
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate('category')
            .exec();
    }

    async findByIdActive(id: string): Promise<IProduct | null> {
        return this._model.findOne({ _id: id, isActive: true }).populate('category').exec();
    }

    async findBySlugActive(slug: string): Promise<IProduct | null> {
        return this._model.findOne({ slug: slug, isActive: true }).populate('category').exec();
    }
}
