import { Router } from "express";
import adminAuthRoutes from "./adminRoutes/adminAuth.routes";
import customerRouter from "./adminRoutes/adminCustomer.routes";
import categoryRouter from "./adminRoutes/adminCategory.routes";
import productRouter from "./adminRoutes/adminProduct.routes";
import adminOrderRouter from "./adminRoutes/adminOrder.routes";
import adminCouponRoutes from "./adminRoutes/adminCoupon.routes";

const adminRouter = Router();

adminRouter.use("/auth", adminAuthRoutes);
adminRouter.use("/customers", customerRouter);
adminRouter.use("/categories", categoryRouter);
adminRouter.use("/products", productRouter);
adminRouter.use("/orders", adminOrderRouter);
adminRouter.use("/coupons", adminCouponRoutes);

export default adminRouter;
