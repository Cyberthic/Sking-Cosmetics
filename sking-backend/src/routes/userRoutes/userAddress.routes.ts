import { Router } from "express";
import container from "../../core/inversify.config";
import { TYPES } from "../../core/types";
import { IUserAddressController } from "../../core/interfaces/controllers/user/IUserAddress.controller";
import { isAuthenticated } from "../../middlewares/auth.middleware";
import { validateResource } from "../../middlewares/validateResource.middleware";
import { addAddressSchema, updateAddressSchema, addressIdSchema } from "../../validations/user/userAddress.validation";

const userAddressRouter = Router();
const userAddressController = container.get<IUserAddressController>(TYPES.IUserAddressController);

userAddressRouter.post("/", isAuthenticated, validateResource(addAddressSchema), (req, res) => userAddressController.addAddress(req, res));
userAddressRouter.get("/", isAuthenticated, (req, res) => userAddressController.getAllAddresses(req, res));
userAddressRouter.get("/:id", isAuthenticated, validateResource(addressIdSchema), (req, res) => userAddressController.getAddress(req, res));
userAddressRouter.put("/:id", isAuthenticated, validateResource(updateAddressSchema), (req, res) => userAddressController.updateAddress(req, res));
userAddressRouter.delete("/:id", isAuthenticated, validateResource(addressIdSchema), (req, res) => userAddressController.deleteAddress(req, res));
userAddressRouter.patch("/:id/primary", isAuthenticated, validateResource(addressIdSchema), (req, res) => userAddressController.setPrimaryAddress(req, res));

export default userAddressRouter;
