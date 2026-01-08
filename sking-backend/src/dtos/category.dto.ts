export interface CreateCategoryDto {
    name: string;
    description?: string;
    offer?: number;
    isActive?: boolean;
}

export interface UpdateCategoryDto {
    name?: string;
    description?: string;
    offer?: number;
    isActive?: boolean;
}
