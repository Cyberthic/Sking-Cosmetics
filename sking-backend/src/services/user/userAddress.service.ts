import { inject, injectable } from "inversify";
import { TYPES } from "../../core/types";
import { IUserAddressService } from "../../core/interfaces/services/user/IUserAddress.service";
import { IUserAddressRepository } from "../../core/interfaces/repositories/user/IUserAddress.repository";
import { CreateAddressDto, UpdateAddressDto } from "../../core/dtos/user/userAddress.dto";
import { IAddress } from "../../models/address.model";
import { CustomError } from "../../utils/customError";
import { StatusCode } from "../../enums/statusCode.enums";

@injectable()
export class UserAddressService implements IUserAddressService {
    constructor(
        @inject(TYPES.IUserAddressRepository) private _userAddressRepository: IUserAddressRepository
    ) { }

    async addAddress(userId: string, data: CreateAddressDto): Promise<IAddress> {
        const count = await this._userAddressRepository.countByUserId(userId);
        if (count >= 5) {
            throw new CustomError("Maximum 5 addresses allowed per user. Please delete an address to add a new one.", StatusCode.BAD_REQUEST);
        }

        if (data.isPrimary) {
            await this._userAddressRepository.resetPrimary(userId);
        } else if (count === 0) {
            // If it's the first address, make it primary by default
            data.isPrimary = true;
        }

        return await this._userAddressRepository.createAddress(data, userId);
    }

    async updateAddress(userId: string, addressId: string, data: UpdateAddressDto): Promise<IAddress> {
        const address = await this._userAddressRepository.findByIdAndUser(addressId, userId);
        if (!address) {
            throw new CustomError("Address not found", StatusCode.NOT_FOUND);
        }

        if (data.isPrimary) {
            await this._userAddressRepository.resetPrimary(userId);
        }

        const updated = await this._userAddressRepository.updateAddress(addressId, userId, data);
        if (!updated) {
            throw new CustomError("Failed to update address", StatusCode.INTERNAL_SERVER_ERROR);
        }
        return updated;
    }

    async deleteAddress(userId: string, addressId: string): Promise<boolean> {
        const address = await this._userAddressRepository.findByIdAndUser(addressId, userId);
        if (!address) {
            throw new CustomError("Address not found", StatusCode.NOT_FOUND);
        }

        const deleted = await this._userAddressRepository.deleteAddress(addressId, userId);

        // If we deleted the primary address, check if there are others and make one primary (optional but good UX)
        if (deleted && address.isPrimary) {
            const addresses = await this._userAddressRepository.findAllByUserId(userId);
            if (addresses.length > 0) {
                const newPrimary = addresses[0];
                await this._userAddressRepository.updateAddress(newPrimary._id.toString(), userId, { isPrimary: true });
            }
        }

        return deleted;
    }

    async getAllAddresses(userId: string): Promise<IAddress[]> {
        return await this._userAddressRepository.findAllByUserId(userId);
    }

    async getAddress(userId: string, addressId: string): Promise<IAddress> {
        const address = await this._userAddressRepository.findByIdAndUser(addressId, userId);
        if (!address) {
            throw new CustomError("Address not found", StatusCode.NOT_FOUND);
        }
        return address;
    }

    async setPrimaryAddress(userId: string, addressId: string): Promise<IAddress> {
        const address = await this._userAddressRepository.findByIdAndUser(addressId, userId);
        if (!address) {
            throw new CustomError("Address not found", StatusCode.NOT_FOUND);
        }

        await this._userAddressRepository.resetPrimary(userId);
        const updated = await this._userAddressRepository.updateAddress(addressId, userId, { isPrimary: true });

        if (!updated) {
            throw new CustomError("Failed to set primary address", StatusCode.INTERNAL_SERVER_ERROR);
        }
        return updated;
    }
}
