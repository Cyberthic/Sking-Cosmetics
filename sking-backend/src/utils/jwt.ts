import jwt from "jsonwebtoken";
import { injectable } from "inversify";
import { Response } from "express";
import { CustomError } from "./customError";
import { StatusCode } from "../enums/statusCode.enums";
import {
  IJwtService,
  JwtAccessPayload,
  JwtRefreshPayload,
} from "../core/interfaces/services/IJwtService";
import logger from "./logger";

@injectable()
export class JwtService implements IJwtService {
  private readonly ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
  private readonly REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

  constructor() {
    if (!this.ACCESS_SECRET || !this.REFRESH_SECRET) {
      logger.warn("JWT Secrets are not defined in environment variables!");
    }
  }

  generateAccessToken(id: string, role: string, tokenVersion: number): string {
    const payload: JwtAccessPayload = { id, role, tokenVersion };
    return jwt.sign(payload, this.ACCESS_SECRET, { expiresIn: "15m" });
  }

  generateRefreshToken(id: string, role: string, tokenVersion: number): string {
    const payload: JwtRefreshPayload = { id, role, tokenVersion };
    return jwt.sign(payload, this.REFRESH_SECRET, { expiresIn: "7d" });
  }

  verifyAccessToken(token: string): JwtAccessPayload {
    try {
      return jwt.verify(token, this.ACCESS_SECRET) as JwtAccessPayload;
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        throw new CustomError("Access token expired", StatusCode.UNAUTHORIZED);
      }
      throw new CustomError("Invalid access token", StatusCode.UNAUTHORIZED);
    }
  }

  verifyRefreshToken(token: string): JwtRefreshPayload {
    try {
      return jwt.verify(token, this.REFRESH_SECRET) as JwtRefreshPayload;
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        throw new CustomError("Refresh token expired", StatusCode.UNAUTHORIZED);
      }
      throw new CustomError("Invalid refresh token", StatusCode.UNAUTHORIZED);
    }
  }

  setTokens(res: Response, accessToken: string, refreshToken: string): void {
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Access token usually sent in body, but can be cookie too.
    // Here we just set refresh token cookie. Access token is returned in body by controller.
  }

  clearTokens(res: Response): void {
    res.clearCookie("refreshToken");
  }
}
