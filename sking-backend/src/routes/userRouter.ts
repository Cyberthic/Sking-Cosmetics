import { Router } from "express";
import userAuthRoutes from "./userRoutes/userAuth.routes";
import userProfileRoutes from "./userRoutes/userProfile.routes";
import userHomeRoutes from "./userRoutes/userHome.routes";
import userProductRoutes from "./userRoutes/userProduct.routes";
import userCartRoutes from "./userRoutes/userCart.routes";
import userWishlistRoutes from "./userRoutes/userWishlist.routes";
import userCategoryRoutes from "./userRoutes/userCategory.routes";
import userAddressRoutes from "./userRoutes/userAddress.routes";
import userCheckoutRoutes from "./userRoutes/userCheckout.routes";
import userOrderRoutes from "./userRoutes/userOrder.routes";
import userCouponRoutes from "./userRoutes/userCoupon.routes";

const userRouter = Router();

userRouter.use("/auth", userAuthRoutes);
userRouter.use("/profile", userProfileRoutes);
userRouter.use("/home", userHomeRoutes);
userRouter.use("/products", userProductRoutes);
userRouter.use("/cart", userCartRoutes);
userRouter.use("/wishlist", userWishlistRoutes);
userRouter.use("/categories", userCategoryRoutes);
userRouter.use("/address", userAddressRoutes);
userRouter.use("/checkout", userCheckoutRoutes);
userRouter.use("/orders", userOrderRoutes);
userRouter.use("/coupons", userCouponRoutes);

export default userRouter;
