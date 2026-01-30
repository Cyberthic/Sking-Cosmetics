import { Router } from "express";
import container from "../../core/inversify.config";
import { TYPES } from "../../core/types";
import { IAdminReviewController } from "../../core/interfaces/controllers/admin/IAdminReview.controller";
import { adminAuthMiddleware } from "../../middlewares/adminAuth.middleware";

const adminReviewRouter = Router();
const controller = container.get<IAdminReviewController>(TYPES.IAdminReviewController);

adminReviewRouter.use(adminAuthMiddleware);

adminReviewRouter.get("/", (req, res, next) => controller.getAllReviews(req, res, next));
adminReviewRouter.get("/:id", (req, res, next) => controller.getReviewById(req, res, next));
adminReviewRouter.post("/block", (req, res, next) => controller.blockReview(req, res, next));
adminReviewRouter.patch("/unblock/:id", (req, res, next) => controller.unblockReview(req, res, next));
adminReviewRouter.delete("/:id", (req, res, next) => controller.deleteReview(req, res, next));
adminReviewRouter.get("/product/:productId", (req, res, next) => controller.getReviewsByProduct(req, res, next));
adminReviewRouter.get("/user/:userId", (req, res, next) => controller.getReviewsByUser(req, res, next));

export default adminReviewRouter;
