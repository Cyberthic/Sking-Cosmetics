import { Request, Response, NextFunction } from "express";
import { CustomError } from "../utils/customError";
import logger from "../utils/logger";
import { StatusCode } from "../enums/statusCode.enums";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    logger.error(`Error: ${err.message}`, { path: req.path, method: req.method });

    if (err instanceof CustomError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
    }

    // Mongoose Validation Error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map((val: any) => val.message).join(', ');
        return res.status(StatusCode.BAD_REQUEST).json({
            success: false,
            message: message
        });
    }

    // Mongoose Duplicate Key Error
    if (err.code === 11000) {
        return res.status(StatusCode.BAD_REQUEST).json({
            success: false,
            message: 'Duplicate key error'
        });
    }

    return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
};
