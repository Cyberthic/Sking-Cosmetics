import { IProduct } from "../../../../models/product.model";

export interface IUserHomeService {
    getHomePageData(): Promise<{ newArrivals: IProduct[]; featured: IProduct[] }>;
}
