import { inject, injectable } from "inversify";
import mongoose from "mongoose";
import { TYPES } from "../../core/types";
import { IFlashSaleService } from "../../core/interfaces/services/admin/IFlashSale.service";
import { IFlashSaleRepository } from "../../core/interfaces/repositories/admin/IFlashSale.repository";
import { IFlashSale } from "../../models/flashSale.model";
import logger from "../../utils/logger";

@injectable()
export class FlashSaleService implements IFlashSaleService {
    constructor(
        @inject(TYPES.IFlashSaleRepository) private _repository: IFlashSaleRepository
    ) { }

    async getFlashSale(isAdmin: boolean = false): Promise<any> {
        const flashSale = await this._repository.getFlashSale();
        if (!flashSale) return null;

        const isActive = flashSale.isActive === true;
        if (!isAdmin && !isActive) {
            return null;
        }

        const now = new Date();
        const start = flashSale.startTime.getTime();
        const duration = flashSale.durationHours * 60 * 60 * 1000;

        const timePassed = now.getTime() - start;
        // If it hasn't started yet, we just show the future start time
        if (timePassed < 0) {
            return {
                ...flashSale.toObject(),
                currentEndTime: new Date(start + duration),
                isUpcoming: true
            };
        }

        // Calculate current cycle
        const cycles = Math.floor(timePassed / duration);
        const currentEndTime = new Date(start + (cycles + 1) * duration);

        // Map products with their flash sale specific offer percentage
        const products = (flashSale.products as any[]).map((item: any) => {
            const product = item.product;
            if (!product) return null;

            // Handle both Mongoose document and plain object
            const productData = typeof product.toObject === 'function' ? product.toObject() : product;

            return {
                ...productData,
                flashSalePercentage: item.offerPercentage || 0
            };
        }).filter(Boolean);

        return {
            ...flashSale.toObject(),
            products,
            currentEndTime
        };
    }

    async updateFlashSale(data: any): Promise<IFlashSale> {
        // 1. Recursive parsing to handle double/triple stringified data
        let pData = data.products;
        let attempts = 0;
        while (typeof pData === 'string' && attempts < 5) {
            try {
                // Clean common single quote issues before parsing
                let sanitized = pData.trim();
                if (sanitized.startsWith("'") && sanitized.endsWith("'")) sanitized = sanitized.slice(1, -1);
                pData = JSON.parse(sanitized.replace(/'/g, '"'));
            } catch (e) {
                break;
            }
            attempts++;
        }

        // 2. Handle array of strings case ["[...]"]
        if (Array.isArray(pData) && pData.length === 1 && typeof pData[0] === 'string' && pData[0].trim().startsWith('[')) {
            try {
                pData = JSON.parse(pData[0].replace(/'/g, '"'));
            } catch (e) { }
        }

        // 3. Clean and Validate
        const cleanProducts: any[] = [];
        if (Array.isArray(pData)) {
            for (let item of pData) {
                // If item itself is a stringized object
                if (typeof item === 'string' && item.trim().startsWith('{')) {
                    try { item = JSON.parse(item.replace(/'/g, '"')); } catch (e) { }
                }

                let pid = null;
                let pct = 0;

                if (item && typeof item === 'object') {
                    pid = item.product || item._id || item.id || item.productId;
                    pct = Number(item.offerPercentage) || 0;

                    // Handle populated object
                    if (pid && typeof pid === 'object') {
                        pid = pid._id || pid.id || pid.toString();
                    }
                } else if (typeof item === 'string' && mongoose.Types.ObjectId.isValid(item)) {
                    pid = item;
                }

                if (pid && mongoose.Types.ObjectId.isValid(String(pid))) {
                    cleanProducts.push({
                        product: new mongoose.Types.ObjectId(String(pid)),
                        offerPercentage: Math.max(0, Math.min(99, pct))
                    });
                }
            }
        }

        // 4. Construct Final Command
        const updateObject = {
            products: cleanProducts.slice(0, 7),
            isActive: String(data.isActive) === 'true' || data.isActive === true,
            durationHours: Number(data.durationHours) || 24,
            startTime: new Date()
        };

        // 5. Direct safety check: if products exists, it MUST be a real array of objects
        // Mongoose 9+ can be strict about schema casting
        return await this._repository.updateFlashSale(updateObject);
    }
}
