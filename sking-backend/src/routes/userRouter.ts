import { Router } from "express";
import userAuthRoutes from "./userRoutes/userAuth.routes";

const userRouter = Router();

userRouter.use("/auth", userAuthRoutes);

export default userRouter;
