import { IUser } from "../../../../models/user.model";
import { AdminCustomerListResponseDto, AdminCustomerDetailResponseDto } from "../../../dtos/admin/adminCustomer.dto";

export interface IAdminCustomerService {
    getAllUsers(page: number, limit: number, search?: string, status?: string, sortBy?: string): Promise<AdminCustomerListResponseDto>;
    getUserById(id: string): Promise<AdminCustomerDetailResponseDto>;
    banUser(id: string): Promise<void>;
    unbanUser(id: string): Promise<void>;
    getCustomerOrders(userId: string, page: number, limit: number): Promise<{ orders: any[], total: number, page: number, limit: number }>;
}
