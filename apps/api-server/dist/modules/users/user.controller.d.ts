import { Request, Response, NextFunction } from 'express';
export declare class UserController {
    private userService;
    constructor();
    getProfile(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateProfile(req: Request, res: Response, next: NextFunction): Promise<void>;
}
