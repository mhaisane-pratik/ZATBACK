import { Request, Response, NextFunction } from 'express';
import { UserService } from './user.service';

export class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    async getProfile(req: Request, res: Response, next: NextFunction) {
        try {
            // Mock Data
            res.json({ id: 1, name: 'Admin', role: 'HOST' });
        } catch (error) {
            next(error);
        }
    }

    async updateProfile(req: Request, res: Response, next: NextFunction) {
        try {
            res.json({ message: 'Profile updated' });
        } catch (error) {
            next(error);
        }
    }
}
