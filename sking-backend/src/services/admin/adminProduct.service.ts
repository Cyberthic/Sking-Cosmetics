import { inject, injectable } from "inversify";
import { TYPES } from "../../core/types";
import { IAdminProductService, IProductWithOffer } from "../../core/interfaces/services/admin/IAdminProduct.service";
import { IAdminProductRepository } from "../../core/interfaces/repositories/admin/IAdminProduct.repository";
import { IProduct } from "../../models/product.model";
import { CreateProductDto, UpdateProductDto } from "../../core/dtos/admin/adminProduct.dto";
import { CustomError } from "../../utils/customError";
import { StatusCode } from "../../enums/statusCode.enums";
import cloudinary from "../../config/cloudinary";
import { IUserOrderRepository } from "../../core/interfaces/repositories/user/IUserOrder.repository";
import streamifier from "streamifier";
import logger from "../../utils/logger";

@injectable()
export class AdminProductService implements IAdminProductService {
    constructor(
        @inject(TYPES.IAdminProductRepository) private _repo: IAdminProductRepository,
        @inject(TYPES.IUserOrderRepository) private _orderRepo: IUserOrderRepository
    ) { }

    private calculateEffectivePrice(product: IProduct): any {
        const productObj = product.toObject ? product.toObject() : product;
        const productOffer = product.offerPercentage || 0;
        // Check if category is populated and has offer
        const categoryOffer = (product.category as any)?.offer || 0;

        const appliedOffer = Math.max(productOffer, categoryOffer);
        const finalPrice = product.price - (product.price * appliedOffer / 100);

        return {
            ...productObj,
            finalPrice: parseFloat(finalPrice.toFixed(2)),
            appliedOffer
        };
    }

    private slugify(text: string): string {
        return text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-")
            .replace(/[^\w\-]+/g, "")
            .replace(/\-\-+/g, "-");
    }

    async createProduct(data: CreateProductDto): Promise<IProduct> {
        const productData: any = { ...data };

        // Generate Slug
        const slug = this.slugify(productData.name);
        const existingProduct = await this._repo.findBySlug(slug);

        if (existingProduct) {
            throw new CustomError("Product with this name already exists (similar slug)", StatusCode.CONFLICT);
        }

        productData.slug = slug;
        return await this._repo.create(productData);
    }

    async getProducts(limit: number, page: number, search?: string, categoryId?: string, sortBy?: string): Promise<{ products: any[]; total: number; totalPages: number }> {
        const skip = (page - 1) * limit;
        const { products, total } = await this._repo.findAll(limit, skip, search, categoryId, sortBy);

        const productsWithPrice = products.map(p => this.calculateEffectivePrice(p));

        const totalPages = Math.ceil(total / limit);
        return { products: productsWithPrice, total, totalPages };
    }

    async getProductById(idOrSlug: string): Promise<any | null> {
        let product;

        // Check if it's a valid ObjectId
        if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
            product = await this._repo.findById(idOrSlug);
        }

        // If not found by ID or not an ID, try by slug
        if (!product) {
            product = await this._repo.findBySlug(idOrSlug);
        }

        if (!product) throw new CustomError("Product not found", StatusCode.NOT_FOUND);
        return this.calculateEffectivePrice(product);
    }

    async updateProduct(id: string, data: UpdateProductDto): Promise<IProduct | null> {
        const productData: any = { ...data };

        if (productData.name) {
            const newSlug = this.slugify(productData.name);
            const existingProduct = await this._repo.findBySlug(newSlug);

            // Check if slug exists and belongs to a DIFFERENT product
            if (existingProduct && existingProduct._id.toString() !== id) {
                throw new CustomError("Product with this name already exists (similar slug)", StatusCode.CONFLICT);
            }
            productData.slug = newSlug;
        }

        const product = await this._repo.update(id, productData);
        if (!product) throw new CustomError("Product not found", StatusCode.NOT_FOUND);
        return product;
    }

    async toggleProductStatus(idOrSlug: string): Promise<IProduct | null> {
        let product;

        if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
            product = await this._repo.findById(idOrSlug);
        }

        if (!product) {
            product = await this._repo.findBySlug(idOrSlug);
        }

        if (!product) throw new CustomError("Product not found", StatusCode.NOT_FOUND);

        const updatedProduct = await this._repo.update(product._id.toString(), { isActive: !product.isActive });
        if (!updatedProduct) throw new CustomError("Failed to update product status", StatusCode.INTERNAL_SERVER_ERROR);

        return this.calculateEffectivePrice(updatedProduct);
    }

    async uploadProductImage(file: any): Promise<string> {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: "products",
                    resource_type: "image"
                },
                (error, result) => {
                    if (error) {
                        logger.error("Cloudinary upload error", error);
                        return reject(new CustomError("Image upload failed", StatusCode.INTERNAL_SERVER_ERROR));
                    }
                    if (result?.secure_url) {
                        resolve(result.secure_url);
                    } else {
                        reject(new CustomError("Image upload failed", StatusCode.INTERNAL_SERVER_ERROR));
                    }
                }
            );
            streamifier.createReadStream(file.buffer).pipe(uploadStream);
        });
    }

    private async resolveProductId(idOrSlug: string): Promise<string> {
        if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
            // It looks like an ObjectId, but let's ensure it exists if strict is needed. 
            // However, assume it's an ID if it matches format to save a DB call if possible, 
            // but for slug vs ID ambiguity, we should probably check DB if we want to be safe,
            // or rely on the repository to handle it. 
            // BUT, findByProductIdPaginated expects a string ID.
            return idOrSlug;
        }

        // Try to find by slug
        const product = await this._repo.findBySlug(idOrSlug);
        if (!product) {
            throw new CustomError("Product not found", StatusCode.NOT_FOUND);
        }
        return product._id.toString();
    }

    async getProductOrders(idOrSlug: string, page: number, limit: number): Promise<{ orders: any[], total: number }> {
        const productId = await this.resolveProductId(idOrSlug);
        return await this._orderRepo.findByProductIdPaginated(productId, page, limit);
    }

    async getProductStats(idOrSlug: string): Promise<any> {
        const productId = await this.resolveProductId(idOrSlug);
        return await this._orderRepo.findStatsByProductId(productId);
    }

    async getTopCustomers(idOrSlug: string, limit: number): Promise<any[]> {
        const productId = await this.resolveProductId(idOrSlug);
        return await this._orderRepo.findTopCustomersByProductId(productId, limit);
    }
}
