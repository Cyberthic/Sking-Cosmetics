import { injectable } from "inversify";
import { IAdminTransactionRepository } from "../../core/interfaces/repositories/admin/IAdminTransaction.repository";
import Transaction, { ITransaction } from "../../models/transaction.model";

@injectable()
export class AdminTransactionRepository implements IAdminTransactionRepository {
    async create(data: Partial<ITransaction>): Promise<ITransaction> {
        return await Transaction.create(data);
    }

    async findAll(limit: number, skip: number, search?: string, status?: string, type?: string, sort?: string): Promise<{ transactions: ITransaction[]; total: number }> {
        const query: any = {};

        if (search) {
            query.$or = [
                { transactionId: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ];
        }

        if (status) query.status = status;
        if (type) query.type = type;

        const sortOption: any = {};
        if (sort) {
            const [field, order] = sort.split(':');
            sortOption[field] = order === 'desc' ? -1 : 1;
        } else {
            sortOption.createdAt = -1;
        }

        const transactions = await Transaction.find(query)
            .populate('user', 'name email profilePicture')
            .populate('order', 'finalAmount orderStatus')
            .sort(sortOption)
            .skip(skip)
            .limit(limit);

        const total = await Transaction.countDocuments(query);

        return { transactions, total };
    }

    async findById(id: string): Promise<ITransaction | null> {
        return await Transaction.findById(id)
            .populate('user', 'name email profilePicture phoneNumber')
            .populate({
                path: 'order',
                select: 'finalAmount orderStatus items',
                populate: {
                    path: 'items.product',
                    select: 'name images'
                }
            });
    }

    async findByUserId(userId: string): Promise<ITransaction[]> {
        return await Transaction.find({ user: userId }).sort({ createdAt: -1 });
    }
}
