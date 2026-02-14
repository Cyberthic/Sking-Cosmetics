import { Router } from "express";
import adminAuthRoutes from "./adminRoutes/adminAuth.routes";
import customerRouter from "./adminRoutes/adminCustomer.routes";
import categoryRouter from "./adminRoutes/adminCategory.routes";
import productRouter from "./adminRoutes/adminProduct.routes";
import adminOrderRouter from "./adminRoutes/adminOrder.routes";
import adminCouponRoutes from "./adminRoutes/adminCoupon.routes";
import adminTransactionRoutes from "./adminRoutes/adminTransaction.routes";
import adminReviewRouter from "./adminRoutes/adminReview.routes";
import dashboardRouter from "./adminRoutes/adminDashboard.routes";

const adminRouter = Router();

adminRouter.use("/auth", adminAuthRoutes);
adminRouter.use("/dashboard", dashboardRouter);
adminRouter.use("/customers", customerRouter);
adminRouter.use("/categories", categoryRouter);
adminRouter.use("/products", productRouter);
adminRouter.use("/orders", adminOrderRouter);
adminRouter.use("/coupons", adminCouponRoutes);
adminRouter.use("/transactions", adminTransactionRoutes);
adminRouter.use("/reviews", adminReviewRouter);

export default adminRouter;
