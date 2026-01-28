import { injectable, unmanaged } from "inversify";
import { BaseRepository } from "../base.repository";
import { IAddress, AddressModel } from "../../models/address.model";
import { IUserAddressRepository } from "../../core/interfaces/repositories/user/IUserAddress.repository";
import { CreateAddressDto, UpdateAddressDto } from "../../core/dtos/user/userAddress.dto";
import { CustomError } from "../../utils/customError";
import { StatusCode } from "../../enums/statusCode.enums";

@injectable()
export class UserAddressRepository extends BaseRepository<IAddress> implements IUserAddressRepository {
    constructor() {
        super(AddressModel);
    }

    async createAddress(data: CreateAddressDto, userId: string): Promise<IAddress> {
        try {
            const address = new this._model({ ...data, user: userId });
            return await address.save();
        } catch (error: any) {
            throw new CustomError(`Database Error: ${error.message}`, StatusCode.INTERNAL_SERVER_ERROR);
        }
    }

    async findAllByUserId(userId: string): Promise<IAddress[]> {
        try {
            return await this._model.find({ user: userId }).exec();
        } catch (error: any) {
            throw new CustomError(`Database Error: ${error.message}`, StatusCode.INTERNAL_SERVER_ERROR);
        }
    }

    async updateAddress(id: string, userId: string, data: UpdateAddressDto): Promise<IAddress | null> {
        try {
            return await this._model.findOneAndUpdate(
                { _id: id, user: userId },
                { $set: data },
                { new: true }
            ).exec();
        } catch (error: any) {
            throw new CustomError(`Database Error: ${error.message}`, StatusCode.INTERNAL_SERVER_ERROR);
        }
    }

    async deleteAddress(id: string, userId: string): Promise<boolean> {
        try {
            const result = await this._model.deleteOne({ _id: id, user: userId }).exec();
            return result.deletedCount === 1;
        } catch (error: any) {
            throw new CustomError(`Database Error: ${error.message}`, StatusCode.INTERNAL_SERVER_ERROR);
        }
    }

    async countByUserId(userId: string): Promise<number> {
        try {
            return await this._model.countDocuments({ user: userId }).exec();
        } catch (error: any) {
            throw new CustomError(`Database Error: ${error.message}`, StatusCode.INTERNAL_SERVER_ERROR);
        }
    }

    async resetPrimary(userId: string): Promise<void> {
        try {
            await this._model.updateMany({ user: userId }, { isPrimary: false }).exec();
        } catch (error: any) {
            throw new CustomError(`Database Error: ${error.message}`, StatusCode.INTERNAL_SERVER_ERROR);
        }
    }

    async findPrimary(userId: string): Promise<IAddress | null> {
        try {
            return await this._model.findOne({ user: userId, isPrimary: true }).exec();
        } catch (error: any) {
            throw new CustomError(`Database Error: ${error.message}`, StatusCode.INTERNAL_SERVER_ERROR);
        }
    }

    async findByIdAndUser(id: string, userId: string): Promise<IAddress | null> {
        try {
            return await this._model.findOne({ _id: id, user: userId }).exec();
        } catch (error: any) {
            throw new CustomError(`Database Error: ${error.message}`, StatusCode.INTERNAL_SERVER_ERROR);
        }
    }
}
