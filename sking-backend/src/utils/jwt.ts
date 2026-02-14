import jwt from "jsonwebtoken";
import { injectable } from "inversify";
import { Response } from "express";
import { CustomError } from "./customError";
import { StatusCode } from "../enums/statusCode.enums";
import {
  IJwtService,
  JwtAccessPayload,
  JwtRefreshPayload,
} from "../core/interfaces/services/IJWT.service";
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

  setTokens(res: Response, accessToken: string, refreshToken: string, role: string): void {
    // @ts-ignore - access request from response
    const req = res.req;
    const host = req?.get("host") || "";
    const isProdDomain = host.includes("skingcosmetics.com");
    const cookieDomain = isProdDomain ? ".skingcosmetics.com" : undefined;

    // Force secure if HTTPS or in production
    const isHttps = req?.protocol === "https" || req?.get("x-forwarded-proto") === "https";
    const isSecure = isHttps || process.env.NODE_ENV === "production";

    const commonOptions = {
      httpOnly: true,
      secure: isSecure,
      sameSite: "lax" as const,
      domain: cookieDomain,
    };

    res.cookie("accessToken", accessToken, {
      ...commonOptions,
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("refreshToken", refreshToken, {
      ...commonOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.cookie("user_role", role, {
      ...commonOptions,
      httpOnly: false,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }

  clearTokens(res: Response): void {
    // @ts-ignore
    const host = res.req?.get("host") || "";
    const isProdDomain = host.includes("skingcosmetics.com");
    const cookieDomain = isProdDomain ? ".skingcosmetics.com" : undefined;

    res.clearCookie("accessToken", { domain: cookieDomain });
    res.clearCookie("refreshToken", { domain: cookieDomain });
    res.clearCookie("user_role", { domain: cookieDomain });
  }
}
