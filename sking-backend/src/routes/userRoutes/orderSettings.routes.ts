import { Router } from "express";
import { container } from "../../core/inversify.config";
import { TYPES } from "../../core/types";
import { IOrderSettingsController } from "../../core/interfaces/controllers/admin/IOrderSettings.controller";

const userOrderSettingsRouter = Router();
const controller = container.get<IOrderSettingsController>(TYPES.IOrderSettingsController);

userOrderSettingsRouter.get("/", controller.getSettings);

export default userOrderSettingsRouter;
