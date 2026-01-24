import { IBaseRepository } from "../IBase.repository";
import { IProduct } from "../../../../models/product.model";

export interface IUserProductRepository extends IBaseRepository<IProduct> {
    findActive(filter: any, sort: any, skip: number, limit: number): Promise<IProduct[]>;
    countActive(filter: any): Promise<number>;
    findNewArrivals(limit: number): Promise<IProduct[]>;
    findByIdActive(id: string): Promise<IProduct | null>;
    findBySlugActive(slug: string): Promise<IProduct | null>;
}
