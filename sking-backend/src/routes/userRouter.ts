import { Router } from "express";
import userAuthRoutes from "./userRoutes/userAuth.routes";
import userProfileRoutes from "./userRoutes/userProfile.routes";
import userHomeRoutes from "./userRoutes/userHome.routes";
import userProductRoutes from "./userRoutes/userProduct.routes";

const userRouter = Router();

userRouter.use("/auth", userAuthRoutes);
userRouter.use("/profile", userProfileRoutes);
userRouter.use("/home", userHomeRoutes);
userRouter.use("/products", userProductRoutes);

export default userRouter;
