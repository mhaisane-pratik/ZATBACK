import { Request, Response, NextFunction } from 'express';
export interface AuthRequest extends Request {
    user?: {
        id: string;
        email?: string;
    };
}
export declare const supabaseAuth: (req: AuthRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>>>;
