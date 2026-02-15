import { injectable } from "inversify";
import { UserModel } from "../../models/user.model";
import OrderModel from "../../models/order.model";
import DashboardConfigModel from "../../models/dashboardConfig.model";
import { ProductModel } from "../../models/product.model";
import { IAdminDashboardRepository } from "../../core/interfaces/repositories/admin/IAdminDashboard.repository";

@injectable()
export class AdminDashboardRepository implements IAdminDashboardRepository {
    async getCustomerCount(startDate?: Date, endDate?: Date): Promise<number> {
        const filter: any = { isAdmin: { $ne: true } };
        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) filter.createdAt.$gte = startDate;
            if (endDate) filter.createdAt.$lte = endDate;
        }
        return await UserModel.countDocuments(filter);
    }

    async getOrderCount(startDate?: Date, endDate?: Date): Promise<number> {
        const filter: any = {};
        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) filter.createdAt.$gte = startDate;
            if (endDate) filter.createdAt.$lte = endDate;
        }
        return await OrderModel.countDocuments(filter);
    }

    async getMonthlySales(startDate: Date, endDate: Date): Promise<{ label: string; totalSales: number; orderCount: number }[]> {
        const diffInDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        const useDayGroup = diffInDays <= 31;

        const sales = await OrderModel.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: useDayGroup
                        ? { $dateToString: { format: "%d %b", date: "$createdAt" } }
                        : { $dateToString: { format: "%b %Y", date: "$createdAt" } },
                    sales: {
                        $sum: {
                            $cond: [{ $eq: ["$paymentStatus", "completed"] }, "$finalAmount", 0]
                        }
                    },
                    count: { $sum: 1 },
                    firstDate: { $min: "$createdAt" }
                }
            },
            {
                $project: {
                    _id: 0,
                    label: "$_id",
                    totalSales: { $ifNull: ["$sales", 0] },
                    orderCount: { $ifNull: ["$count", 0] },
                    firstDate: 1
                }
            },
            {
                $sort: { firstDate: 1 }
            }
        ]);
        return sales;
    }

    async getMonthlyRevenue(startDate: Date, endDate: Date): Promise<number> {
        const result = await OrderModel.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate, $lte: endDate },
                    paymentStatus: "completed"
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$finalAmount" }
                }
            }
        ]);
        return result.length > 0 ? (result[0].totalRevenue || 0) : 0;
    }

    async getMonthlyTarget(month: number, year: number): Promise<number> {
        const config = await DashboardConfigModel.findOne({ month, year });
        return config ? (config.monthlyTarget || 0) : 0;
    }

    async updateMonthlyTarget(month: number, year: number, target: number): Promise<void> {
        await DashboardConfigModel.findOneAndUpdate(
            { month, year },
            { monthlyTarget: target },
            { upsert: true, new: true }
        );
    }

    async getCustomerPerformance(startDate: Date, endDate: Date): Promise<{ label: string; acquisition: number; retention: number }[]> {
        const diffInDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        const useDayGroup = diffInDays <= 31;

        const performance = await OrderModel.aggregate([
            {
                $match: { paymentStatus: "completed" }
            },
            {
                $sort: { createdAt: 1 }
            },
            {
                $group: {
                    _id: "$user",
                    orders: {
                        $push: {
                            date: "$createdAt",
                            _id: "$_id"
                        }
                    }
                }
            },
            {
                $unwind: {
                    path: "$orders",
                    includeArrayIndex: "orderIndex"
                }
            },
            {
                $match: {
                    "orders.date": { $gte: startDate, $lte: endDate }
                }
            },
            {
                $project: {
                    label: useDayGroup
                        ? { $dateToString: { format: "%d %b", date: "$orders.date" } }
                        : { $dateToString: { format: "%b %Y", date: "$orders.date" } },
                    date: "$orders.date",
                    isFirstOrder: { $eq: ["$orderIndex", 0] }
                }
            },
            {
                $group: {
                    _id: "$label",
                    acquisition: {
                        $sum: { $cond: ["$isFirstOrder", 1, 0] }
                    },
                    retention: {
                        $sum: { $cond: ["$isFirstOrder", 0, 1] }
                    },
                    firstDate: { $min: "$date" }
                }
            },
            {
                $project: {
                    _id: 0,
                    label: "$_id",
                    acquisition: 1,
                    retention: 1,
                    firstDate: 1
                }
            },
            {
                $sort: { firstDate: 1 }
            }
        ]);
        return performance;
    }

    async getRecentOrders(count: number): Promise<any[]> {
        return await OrderModel.find()
            .sort({ createdAt: -1 })
            .limit(count)
            .populate("user", "name email")
            .populate("items.product", "images")
            .exec();
    }

    async getDemographics(): Promise<{ country: string, orderCount: number, percentage: number, code?: string }[]> {
        const totalOrders = await OrderModel.countDocuments({ orderStatus: { $ne: 'cancelled' } });
        if (totalOrders === 0) return [];

        const demographics = await OrderModel.aggregate([
            {
                $match: { orderStatus: { $ne: 'cancelled' } }
            },
            {
                $group: {
                    _id: "$shippingAddress.country",
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    country: "$_id",
                    orderCount: "$count",
                    percentage: {
                        $multiply: [{ $divide: ["$count", totalOrders] }, 100]
                    }
                }
            },
            {
                $sort: { orderCount: -1 }
            }
        ]);

        const countryCodes: Record<string, string> = {
            "india": "IN",
            "usa": "US",
            "united states": "US",
            "united states of america": "US",
            "united kingdom": "GB",
            "uk": "GB",
            "france": "FR",
            "canada": "CA",
            "germany": "DE",
            "uae": "AE"
        };

        return demographics.map(d => ({
            ...d,
            code: countryCodes[d.country.toLowerCase().trim()] || "IN" // Fallback to IN or dynamic logic
        }));
    }

    async getStateDemographics(): Promise<{ state: string, orderCount: number, percentage: number, code?: string }[]> {
        // Broaden the search for India to handle variations
        const totalIndiaOrders = await OrderModel.countDocuments({
            orderStatus: { $ne: 'cancelled' },
            "shippingAddress.country": { $regex: /india/i }
        });

        if (totalIndiaOrders === 0) return [];

        const stateData = await OrderModel.aggregate([
            {
                $match: {
                    orderStatus: { $ne: 'cancelled' },
                    "shippingAddress.country": { $regex: /india/i }
                }
            },
            {
                $group: {
                    _id: "$shippingAddress.state",
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    state: "$_id",
                    orderCount: "$count",
                    percentage: {
                        $multiply: [{ $divide: ["$count", totalIndiaOrders] }, 100]
                    }
                }
            },
            {
                $sort: { orderCount: -1 }
            }
        ]);

        // Comprehensive JVectorMap India codes + Common Abbreviations/Variations
        const stateCodes: Record<string, string> = {
            "andaman and nicobar islands": "IN-AN", "andaman": "IN-AN", "nicobar": "IN-AN", "an": "IN-AN",
            "andhra pradesh": "IN-AP", "andhra": "IN-AP", "ap": "IN-AP",
            "arunachal pradesh": "IN-AR", "arunachal": "IN-AR", "ar": "IN-AR",
            "assam": "IN-AS", "as": "IN-AS",
            "bihar": "IN-BR", "br": "IN-BR",
            "chandigarh": "IN-CH", "ch": "IN-CH",
            "chhattisgarh": "IN-CT", "ct": "IN-CT", "cg": "IN-CT",
            "dadra and nagar haveli": "IN-DN", "dn": "IN-DN",
            "daman and diu": "IN-DD", "dd": "IN-DD",
            "delhi": "IN-DL", "new delhi": "IN-DL", "dl": "IN-DL",
            "goa": "IN-GA", "ga": "IN-GA",
            "gujarat": "IN-GJ", "gj": "IN-GJ",
            "haryana": "IN-HR", "hr": "IN-HR",
            "himachal pradesh": "IN-HP", "hp": "IN-HP",
            "jammu and kashmir": "IN-JK", "jk": "IN-JK",
            "jharkhand": "IN-JH", "jh": "IN-JH",
            "karnataka": "IN-KA", "ka": "IN-KA",
            "kerala": "IN-KL", "kl": "IN-KL",
            "ladakh": "IN-LA", "la": "IN-LA",
            "lakshadweep": "IN-LD", "ld": "IN-LD",
            "madhya pradesh": "IN-MP", "mp": "IN-MP",
            "maharashtra": "IN-MH", "mh": "IN-MH", "mumbai": "IN-MH",
            "manipur": "IN-MN", "mn": "IN-MN",
            "meghalaya": "IN-ML", "ml": "IN-ML",
            "mizoram": "IN-MZ", "mz": "IN-MZ",
            "nagaland": "IN-NL", "nl": "IN-NL",
            "odisha": "IN-OR", "orissa": "IN-OR", "or": "IN-OR",
            "puducherry": "IN-PY", "py": "IN-PY", "pondicherry": "IN-PY",
            "punjab": "IN-PB", "pb": "IN-PB",
            "rajasthan": "IN-RJ", "rj": "IN-RJ",
            "sikkim": "IN-SK", "sk": "IN-SK",
            "tamil nadu": "IN-TN", "tn": "IN-TN", "chennai": "IN-TN",
            "telangana": "IN-TG", "tg": "IN-TG", "ts": "IN-TG",
            "tripura": "IN-TR", "tr": "IN-TR",
            "uttar pradesh": "IN-UP", "up": "IN-UP",
            "uttarakhand": "IN-UT", "ut": "IN-UT", "uk": "IN-UT",
            "west bengal": "IN-WB", "wb": "IN-WB", "bengal": "IN-WB"
        };

        return stateData.map(s => {
            const rawState = String(s.state || "");
            const normalized = rawState.toLowerCase().trim();
            let code = stateCodes[normalized];

            // Robust fallback with broader matching
            if (!code) {
                const searchStr = normalized.replace(/[^a-z]/g, '');
                if (searchStr.includes("kerala") || searchStr === "kl" || searchStr === "ke") {
                    code = "IN-KL";
                } else if (searchStr.includes("andaman") || searchStr.includes("nicobar") || searchStr === "an") {
                    code = "IN-AN";
                } else if (searchStr.includes("delhi") || searchStr === "dl") {
                    code = "IN-DL";
                } else if (searchStr.includes("maharashtra") || searchStr === "mh") {
                    code = "IN-MH";
                } else if (searchStr.includes("tamil") || searchStr === "tn") {
                    code = "IN-TN";
                } else if (searchStr.includes("karnataka") || searchStr === "ka") {
                    code = "IN-KA";
                } else if (searchStr.includes("gujarat") || searchStr === "gj") {
                    code = "IN-GJ";
                } else if (searchStr.includes("telangana") || searchStr === "tg" || searchStr === "ts") {
                    code = "IN-TG";
                } else if (searchStr.includes("andhra") || searchStr === "ap") {
                    code = "IN-AP";
                } else if (searchStr.includes("westbengal") || searchStr.includes("bengal") || searchStr === "wb") {
                    code = "IN-WB";
                }
            }

            return {
                ...s,
                code: code || `IN-${normalized.substring(0, 2).toUpperCase()}`
            };
        });
    }
}
