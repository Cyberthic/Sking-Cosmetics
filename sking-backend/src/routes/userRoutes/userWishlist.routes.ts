import { Router } from "express";
import container from "../../core/inversify.config";
import { TYPES } from "../../core/types";
import { UserWishlistController } from "../../controllers/user/userWishlist.controller";
import { isAuthenticated } from "../../middlewares/auth.middleware";

const userWishlistRouter = Router();
const wishlistController = container.get<UserWishlistController>(TYPES.IUserWishlistController);

userWishlistRouter.use(isAuthenticated);
userWishlistRouter.get("/", wishlistController.getWishlist.bind(wishlistController));
userWishlistRouter.post("/toggle", wishlistController.toggleWishlist.bind(wishlistController));

export default userWishlistRouter;
