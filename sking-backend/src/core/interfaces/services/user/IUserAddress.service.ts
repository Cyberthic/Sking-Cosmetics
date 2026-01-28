import { IAddress } from "../../../../models/address.model";
import { CreateAddressDto, UpdateAddressDto } from "../../../dtos/user/userAddress.dto";

export interface IUserAddressService {
    addAddress(userId: string, data: CreateAddressDto): Promise<IAddress>;
    updateAddress(userId: string, addressId: string, data: UpdateAddressDto): Promise<IAddress>;
    deleteAddress(userId: string, addressId: string): Promise<boolean>;
    getAllAddresses(userId: string): Promise<IAddress[]>;
    getAddress(userId: string, addressId: string): Promise<IAddress>;
    setPrimaryAddress(userId: string, addressId: string): Promise<IAddress>;
}
