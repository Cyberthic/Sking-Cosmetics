import { Router } from "express";
import container from "../../core/inversify.config";
import { TYPES } from "../../core/types";
import { UserCategoryController } from "../../controllers/user/userCategory.controller";

const userCategoryRouter = Router();
const controller = container.get<UserCategoryController>(TYPES.UserCategoryController);

userCategoryRouter.get("/", controller.getCategories.bind(controller));

export default userCategoryRouter;
