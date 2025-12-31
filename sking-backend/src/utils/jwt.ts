import jwt from "jsonwebtoken";
import { injectable } from "inversify";
import { CustomError } from "../utils/customError";
import { StatusCode } from "../enums/statusCode.enums";
import {
  IJwtService,
  JwtAccessPayload,
  JwtRefreshPayload,
} from "../services/interfaces/IJwt.service";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

@injectable()
export class JwtService implements IJwtService {
  private getAccessSecret(): string {
    if (!ACCESS_SECRET) {
      throw new CustomError(
        "JWT_ACCESS_SECRET is not defined",
        StatusCode.INTERNAL_SERVER_ERROR
      );
    }
    return ACCESS_SECRET;
  }

  private getRefreshSecret(): string {
    if (!REFRESH_SECRET) {
      throw new CustomError(
        "JWT_REFRESH_SECRET is not defined",
        StatusCode.INTERNAL_SERVER_ERROR
      );
    }
    return REFRESH_SECRET;
  }

  generateAccessToken(payload: JwtAccessPayload): string {
    return jwt.sign(payload, this.getAccessSecret(), {
      expiresIn: "15m",
    });
  }

  generateRefreshToken(payload: JwtRefreshPayload): string {
    return jwt.sign(payload, this.getRefreshSecret(), {
      expiresIn: "7d",
    });
  }

  verifyAccessToken(token: string): JwtAccessPayload {
    try {
      return jwt.verify(token, this.getAccessSecret()) as JwtAccessPayload;
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        throw new CustomError("Access token expired", StatusCode.UNAUTHORIZED);
      }
      throw new CustomError("Invalid access token", StatusCode.UNAUTHORIZED);
    }
  }

  verifyRefreshToken(token: string): JwtRefreshPayload {
    try {
      return jwt.verify(token, this.getRefreshSecret()) as JwtRefreshPayload;
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        throw new CustomError("Refresh token expired", StatusCode.UNAUTHORIZED);
      }
      throw new CustomError("Invalid refresh token", StatusCode.UNAUTHORIZED);
    }
  }
}
