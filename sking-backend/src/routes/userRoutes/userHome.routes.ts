import { Router } from "express";
import container from "../../core/inversify.config";
import { TYPES } from "../../core/types";
import { UserHomeController } from "../../controllers/user/userHome.controller";

const userHomeRouter = Router();

const homeController = container.get<UserHomeController>(TYPES.IUserHomeController);

userHomeRouter.get("/", homeController.getHomeData.bind(homeController));

export default userHomeRouter;
