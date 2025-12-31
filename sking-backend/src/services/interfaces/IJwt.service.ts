export interface JwtAccessPayload {
  userId: string;
  role: "user" | "admin" | "vendor";
  tokenVersion: number;
  iat?: number;
  exp?: number;
}

export interface JwtRefreshPayload {
  userId: string;
  tokenVersion: number;
  iat?: number;
  exp?: number;
}

export interface IJwtService {
  generateAccessToken(payload: JwtAccessPayload): string;
  generateRefreshToken(payload: JwtRefreshPayload): string;

  verifyAccessToken(token: string): JwtAccessPayload;
  verifyRefreshToken(token: string): JwtRefreshPayload;
}
