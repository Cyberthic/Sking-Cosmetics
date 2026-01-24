import { Router } from "express";
import userAuthRoutes from "./userRoutes/userAuth.routes";
import userProfileRoutes from "./userRoutes/userProfile.routes";
import userHomeRoutes from "./userRoutes/userHome.routes";
import userProductRoutes from "./userRoutes/userProduct.routes";
import userCartRoutes from "./userRoutes/userCart.routes";
import userWishlistRoutes from "./userRoutes/userWishlist.routes";
import userCategoryRoutes from "./userRoutes/userCategory.routes";

const userRouter = Router();

userRouter.use("/auth", userAuthRoutes);
userRouter.use("/profile", userProfileRoutes);
userRouter.use("/home", userHomeRoutes);
userRouter.use("/products", userProductRoutes);
userRouter.use("/cart", userCartRoutes);
userRouter.use("/wishlist", userWishlistRoutes);
userRouter.use("/categories", userCategoryRoutes);

export default userRouter;
