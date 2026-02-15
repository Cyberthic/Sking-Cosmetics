import { Router } from "express";
import { container } from "../../core/inversify.config";
import { TYPES } from "../../core/types";
import { IOrderSettingsController } from "../../core/interfaces/controllers/admin/IOrderSettings.controller";

const adminOrderSettingsRouter = Router();
const controller = container.get<IOrderSettingsController>(TYPES.IOrderSettingsController);

adminOrderSettingsRouter.get("/", controller.getSettings);
adminOrderSettingsRouter.put("/", controller.updateSettings);

export default adminOrderSettingsRouter;
