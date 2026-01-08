import { Router } from "express";
import adminAuthRoutes from "./adminRoutes/adminAuth.routes";
import customerRouter from "./adminRoutes/adminCustomer.routes";
import categoryRouter from "./adminRoutes/adminCategory.routes";
import productRouter from "./adminRoutes/adminProduct.routes";

const adminRouter = Router();

adminRouter.use("/auth", adminAuthRoutes);
adminRouter.use("/customers", customerRouter);
adminRouter.use("/categories", categoryRouter);
adminRouter.use("/products", productRouter);

export default adminRouter;
