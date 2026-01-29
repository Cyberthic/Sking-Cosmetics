import { ITransaction } from "../../../../models/transaction.model";

export interface IAdminTransactionService {
    createTransaction(data: Partial<ITransaction>): Promise<ITransaction>;
    getTransactions(limit: number, page: number, search?: string, status?: string, type?: string, sort?: string): Promise<{ transactions: ITransaction[]; total: number; totalPages: number }>;
    getTransactionById(id: string): Promise<ITransaction | null>;
}
