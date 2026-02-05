import { Request, Response, NextFunction } from 'express';

export class HttpException extends Error {
    constructor(public message: string, public statusCode: number) {
        super(message);
        this.name = 'HttpException';
    }
}

export const GlobalExceptionFilter = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error('[GlobalExceptionFilter]', err);

    if (err instanceof HttpException) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            statusCode: err.statusCode,
        });
    }

    // Default 500
    return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        statusCode: 500,
    });
};
