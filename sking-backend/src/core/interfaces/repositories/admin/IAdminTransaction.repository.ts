import { ITransaction } from "../../../../models/transaction.model";

export interface IAdminTransactionRepository {
    create(data: Partial<ITransaction>): Promise<ITransaction>;
    findAll(limit: number, skip: number, search?: string, status?: string, type?: string, sort?: string): Promise<{ transactions: ITransaction[]; total: number }>;
    findById(id: string): Promise<ITransaction | null>;
    findByUserId(userId: string): Promise<ITransaction[]>;
}
