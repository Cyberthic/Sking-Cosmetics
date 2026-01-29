import { Router } from "express";
import { container } from "../../core/inversify.config";
import { TYPES } from "../../core/types";
import { IAdminTransactionController } from "../../core/interfaces/controllers/admin/IAdminTransaction.controller";
import { adminAuthMiddleware } from "../../middlewares/adminAuth.middleware";

const router = Router();
const transactionController = container.get<IAdminTransactionController>(TYPES.IAdminTransactionController);

router.use(adminAuthMiddleware);

router.get("/", (req, res) => transactionController.getTransactions(req, res));
router.get("/:id", (req, res) => transactionController.getTransactionById(req, res));

export default router;
