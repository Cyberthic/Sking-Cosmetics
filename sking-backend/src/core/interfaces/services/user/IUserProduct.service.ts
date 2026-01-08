import { IProduct } from "../../../../models/product.model";

export interface IUserProductService {
    getProducts(query: any): Promise<{ products: IProduct[]; total: number; page: number; pages: number }>;
    getProductById(id: string): Promise<IProduct>;
    getRelatedProducts(id: string, limit: number): Promise<IProduct[]>;
}
