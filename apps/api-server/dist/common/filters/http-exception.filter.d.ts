import { Request, Response, NextFunction } from 'express';
export declare class HttpException extends Error {
    message: string;
    statusCode: number;
    constructor(message: string, statusCode: number);
}
export declare const GlobalExceptionFilter: (err: Error, req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
