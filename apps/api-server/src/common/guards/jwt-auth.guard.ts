import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { HttpException } from '../filters/http-exception.filter';

export interface AuthRequest extends Request {
    user?: any;
}

export const JwtAuthGuard = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return next(new HttpException('No token provided', 401));
    }

    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
        return next(new HttpException('Invalid token format', 401));
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        req.user = payload;
        next();
    } catch (error) {
        return next(new HttpException('Invalid or expired token', 401));
    }
};
