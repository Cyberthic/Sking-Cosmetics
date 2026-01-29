import { injectable, inject } from "inversify";
import { TYPES } from "../../core/types";
import { IAdminTransactionService } from "../../core/interfaces/services/admin/IAdminTransaction.service";
import { IAdminTransactionRepository } from "../../core/interfaces/repositories/admin/IAdminTransaction.repository";
import { ITransaction } from "../../models/transaction.model";
import { CustomError } from "../../utils/customError";
import { StatusCode } from "../../enums/statusCode.enums";

@injectable()
export class AdminTransactionService implements IAdminTransactionService {
    constructor(
        @inject(TYPES.IAdminTransactionRepository) private _repo: IAdminTransactionRepository
    ) { }

    async createTransaction(data: Partial<ITransaction>): Promise<ITransaction> {
        return await this._repo.create(data);
    }

    async getTransactions(limit: number, page: number, search?: string, status?: string, type?: string, sort?: string): Promise<{ transactions: ITransaction[]; total: number; totalPages: number }> {
        const skip = (page - 1) * limit;
        const { transactions, total } = await this._repo.findAll(limit, skip, search, status, type, sort);

        return {
            transactions,
            total,
            totalPages: Math.ceil(total / limit)
        };
    }

    async getTransactionById(id: string): Promise<ITransaction | null> {
        const transaction = await this._repo.findById(id);
        if (!transaction) throw new CustomError("Transaction not found", StatusCode.NOT_FOUND);
        return transaction;
    }
}
