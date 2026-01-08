export interface VariantDto {
    name: string;
    stock: number;
}

export interface CreateProductDto {
    name: string;
    description?: string;
    category: string;
    price: number;
    offer?: number;
    images: string[];
    variants: VariantDto[];
    isActive?: boolean;
}

export interface UpdateProductDto {
    name?: string;
    description?: string;
    category?: string;
    price?: number;
    offer?: number;
    images?: string[];
    variants?: VariantDto[];
    isActive?: boolean;
}
