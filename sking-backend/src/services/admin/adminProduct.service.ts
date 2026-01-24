import { inject, injectable } from "inversify";
import { TYPES } from "../../core/types";
import { IAdminProductService, IProductWithOffer } from "../../core/interfaces/services/admin/IAdminProduct.service";
import { IAdminProductRepository } from "../../core/interfaces/repositories/admin/IAdminProduct.repository";
import { IProduct } from "../../models/product.model";
import { CreateProductDto, UpdateProductDto } from "../../core/dtos/admin/adminProduct.dto";
import { CustomError } from "../../utils/customError";
import { StatusCode } from "../../enums/statusCode.enums";
import cloudinary from "../../config/cloudinary";
import streamifier from "streamifier";
import logger from "../../utils/logger";

@injectable()
export class AdminProductService implements IAdminProductService {
    constructor(
        @inject(TYPES.IAdminProductRepository) private _repo: IAdminProductRepository
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

    async getProducts(limit: number, page: number, search?: string, categoryId?: string): Promise<{ products: any[]; total: number; totalPages: number }> {
        const skip = (page - 1) * limit;
        const { products, total } = await this._repo.findAll(limit, skip, search, categoryId);

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

    async deleteProduct(id: string): Promise<IProduct | null> {
        const product = await this._repo.delete(id);
        if (!product) throw new CustomError("Product not found", StatusCode.NOT_FOUND);
        return product;
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
}
