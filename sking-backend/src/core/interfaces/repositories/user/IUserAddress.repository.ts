import { IAddress } from "../../../../models/address.model";
import { CreateAddressDto, UpdateAddressDto } from "../../../dtos/user/userAddress.dto";
import { IBaseRepository } from "../IBase.repository";

export interface IUserAddressRepository extends IBaseRepository<IAddress> {
    createAddress(data: CreateAddressDto, userId: string): Promise<IAddress>;
    findAllByUserId(userId: string): Promise<IAddress[]>;
    updateAddress(id: string, userId: string, data: UpdateAddressDto): Promise<IAddress | null>;
    deleteAddress(id: string, userId: string): Promise<boolean>;
    countByUserId(userId: string): Promise<number>;
    resetPrimary(userId: string): Promise<void>;
    findPrimary(userId: string): Promise<IAddress | null>;
    findByIdAndUser(id: string, userId: string): Promise<IAddress | null>;
}

