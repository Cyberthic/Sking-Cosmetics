import { Router } from "express";
import rateLimit from 'express-rate-limit';
import container from "../../core/inversify.config";
import { TYPES } from "../../core/types";
import { IUserAuthController } from "../../core/interfaces/controllers/user/IUserAuth.controllers";
import { validateResource } from "../../middlewares/validateResource.middleware";
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema, verifyOtpSchema } from "../../validations/user/userAuth.validation";

const userAuthRouter = Router();
const userAuthController = container.get<IUserAuthController>(TYPES.IUserAuthController);


const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
});

const resetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
});

userAuthRouter.post("/register", validateResource(registerSchema), (req, res) => userAuthController.register(req, res));
userAuthRouter.post("/login", validateResource(loginSchema), (req, res) => userAuthController.login(req, res));
userAuthRouter.post("/request-otp", (req, res) => userAuthController.requestOtp(req, res));
userAuthRouter.post("/verify-otp", validateResource(verifyOtpSchema), (req, res) => userAuthController.verifyOtp(req, res));
userAuthRouter.post("/check-username", (req, res) => userAuthController.checkUsername(req, res));
userAuthRouter.get("/generate-username", (req, res) => userAuthController.generateUsername(req, res));
userAuthRouter.post("/forgot-password", validateResource(forgotPasswordSchema), (req, res) => userAuthController.forgotPassword(req, res));
userAuthRouter.post("/verify-forgot-otp", (req, res) => userAuthController.verifyForgotPasswordOtp(req, res));
userAuthRouter.post("/reset-password", validateResource(resetPasswordSchema), (req, res) => userAuthController.resetPassword(req, res));
userAuthRouter.post("/resend-otp", (req, res) => userAuthController.resendOtp(req, res));
userAuthRouter.post("/refresh-token", (req, res) => userAuthController.refreshAccessToken(req, res));
userAuthRouter.post("/google-login", (req, res) => userAuthController.googleLogin(req, res));
userAuthRouter.post("/logout", (req, res) => userAuthController.logout(req, res));

export default userAuthRouter;
