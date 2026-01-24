import { IProduct } from "../../../../models/product.model";

export interface IAdminProductRepository {
    create(data: Partial<IProduct>): Promise<IProduct>;
    findAll(limit: number, skip: number, search?: string, categoryId?: string): Promise<{ products: IProduct[]; total: number }>;
    findById(id: string): Promise<IProduct | null>;
    update(id: string, data: Partial<IProduct>): Promise<IProduct | null>;
    delete(id: string): Promise<IProduct | null>;
    findByCategory(categoryId: string): Promise<IProduct[]>;
    findBySlug(slug: string): Promise<IProduct | null>;
}
