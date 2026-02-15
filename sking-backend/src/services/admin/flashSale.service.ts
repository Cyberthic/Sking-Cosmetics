import { inject, injectable } from "inversify";
import { TYPES } from "../../core/types";
import { IFlashSaleService } from "../../core/interfaces/services/admin/IFlashSale.service";
import { IFlashSaleRepository } from "../../core/interfaces/repositories/admin/IFlashSale.repository";
import { IFlashSale } from "../../models/flashSale.model";

@injectable()
export class FlashSaleService implements IFlashSaleService {
    constructor(
        @inject(TYPES.IFlashSaleRepository) private _repository: IFlashSaleRepository
    ) { }

    async getFlashSale(isAdmin: boolean = false): Promise<any> {
        const flashSale = await this._repository.getFlashSale();
        if (!flashSale) return null;

        if (!isAdmin && (!flashSale.isActive || flashSale.products.length === 0)) {
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

        // Add random percentage logic to products
        const products = (flashSale.products as any[]).map((product: any) => {
            let offerPercentage = product.offerPercentage;
            if (!offerPercentage || offerPercentage === 0) {
                // Return a consistent "random" percentage based on product ID
                const hash = product._id.toString().split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
                offerPercentage = 5 + (hash % 36); // 5 to 40
            }
            return {
                ...product.toObject(),
                flashSalePercentage: offerPercentage
            };
        });

        return {
            ...flashSale.toObject(),
            products,
            currentEndTime
        };
    }

    async updateFlashSale(data: any): Promise<IFlashSale> {
        // Ensure max 7 products
        if (data.products && data.products.length > 7) {
            data.products = data.products.slice(0, 7);
        }
        return await this._repository.updateFlashSale(data);
    }
}
