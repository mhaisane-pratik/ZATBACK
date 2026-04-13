import { Response } from "express";
export declare class SettingsController {
    get: (req: any, res: Response) => Promise<void>;
    updateProfile: (req: any, res: Response) => Promise<void>;
    updateSection: (req: any, res: Response) => Promise<void>;
    uploadAvatar: any[];
    deleteAvatar: (req: any, res: Response) => Promise<void>;
    changePassword: (req: any, res: Response) => Promise<void>;
    reset: (req: any, res: Response) => Promise<void>;
    deleteAccount: (req: any, res: Response) => Promise<void>;
}
