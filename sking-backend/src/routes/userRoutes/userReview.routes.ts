import { Router } from "express";
import container from "../../core/inversify.config";
import { TYPES } from "../../core/types";
import { IUserReviewController } from "../../core/interfaces/controllers/user/IUserReview.controller";
import { createReviewSchema } from "../../validations/user/userReview.validation";
import { validateResource } from "../../middlewares/validateResource.middleware";
import { isAuthenticated } from "../../middlewares/auth.middleware";

const userReviewRouter = Router();
const userReviewController = container.get<IUserReviewController>(TYPES.IUserReviewController);

userReviewRouter.get("/product/:productId", (req, res, next) => userReviewController.getProductReviews(req, res, next));
userReviewRouter.get("/check-can-review", isAuthenticated, (req, res, next) => userReviewController.checkCanReview(req, res, next));
userReviewRouter.post("/", isAuthenticated, validateResource(createReviewSchema), (req, res, next) => userReviewController.createReview(req, res, next));

export default userReviewRouter;
