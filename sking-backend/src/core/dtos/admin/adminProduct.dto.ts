export interface VariantDto {
    size: string;
    stock: number;
    price: number;
}

export interface IngredientDto {
    name: string;
    description: string;
}

export interface CreateProductDto {
    name: string;
    shortDescription: string;
    description: string;
    category: string;
    price: number;
    offerPercentage?: number;
    images: string[];
    variants: VariantDto[];
    ingredients?: IngredientDto[];
    howToUse?: string[];
    isActive?: boolean;
}

export interface UpdateProductDto {
    name?: string;
    shortDescription?: string;
    description?: string;
    category?: string;
    price?: number;
    offerPercentage?: number;
    images?: string[];
    variants?: VariantDto[];
    ingredients?: IngredientDto[];
    howToUse?: string[];
    isActive?: boolean;
}
