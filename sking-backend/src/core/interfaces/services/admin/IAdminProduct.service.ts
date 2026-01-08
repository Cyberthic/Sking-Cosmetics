import { IProduct } from "../../../../models/product.model";
import { CreateProductDto, UpdateProductDto } from "../../../dtos/admin/adminProduct.dto";


export interface IProductWithOffer extends IProduct {
    finalPrice: number;
    appliedOffer: number;
}

export interface IAdminProductService {
    createProduct(data: CreateProductDto): Promise<IProduct>;
    getProducts(limit: number, page: number, search?: string, categoryId?: string): Promise<{ products: any[]; total: number; totalPages: number }>;
    getProductById(id: string): Promise<any | null>; // Returns product with calculated price
    updateProduct(id: string, data: UpdateProductDto): Promise<IProduct | null>;
    deleteProduct(id: string): Promise<IProduct | null>;
    uploadProductImage(file: any): Promise<string>;
}
