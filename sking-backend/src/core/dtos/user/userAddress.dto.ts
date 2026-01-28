export interface CreateAddressDto {
    name: string;
    phoneNumber: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isPrimary?: boolean;
    type?: string;
}

export interface UpdateAddressDto {
    name?: string;
    phoneNumber?: string;
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    isPrimary?: boolean;
    type?: string;
}

export interface AddressResponseDto {
    _id: string;
    name: string;
    phoneNumber: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isPrimary: boolean;
    type: string;
    createdAt?: Date;
    updatedAt?: Date;
}
