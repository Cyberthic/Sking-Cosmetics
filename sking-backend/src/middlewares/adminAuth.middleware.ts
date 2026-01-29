import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AdminAuthRequest extends Request {
    user?: any;
}

export const adminAuthMiddleware = async (req: AdminAuthRequest, res: Response, next: NextFunction) => {
    try {
        let token = req.header("Authorization")?.replace("Bearer ", "");

        if (!token && req.cookies && req.cookies.accessToken) {
            token = req.cookies.accessToken;
        }

        if (!token) {
            return res.status(401).json({ success: false, message: "Access Denied. No token provided." });
        }

        const secret = process.env.JWT_ACCESS_SECRET;
        if (!secret) throw new Error("JWT_ACCESS_SECRET is not defined.");

        const verified = jwt.verify(token, secret) as any;

        // Ensure the token has the admin role
        if (!verified.role || verified.role !== 'admin') {
            return res.status(403).json({ success: false, message: "Access Denied. Admins only." });
        }

        req.user = verified;
        next();
    } catch (err) {
        res.status(401).json({ success: false, message: "Invalid or Expired Token" });
    }
};
