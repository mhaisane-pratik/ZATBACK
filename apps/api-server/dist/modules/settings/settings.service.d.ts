import { UserSettings } from "./settings.entity";
import multer from "multer";
export declare class SettingsService {
    private repo;
    private avatarDir;
    constructor();
    get(userId: string): Promise<UserSettings>;
    updateProfile(userId: string, data: any): Promise<UserSettings>;
    updateSettings(userId: string, section: string, data: any): Promise<any>;
    uploadAvatar(userId: string, file: multer.File): Promise<string>;
    deleteAvatar(userId: string): Promise<void>;
    changePassword(userId: string, current: string, next: string): Promise<void>;
    resetSettings(userId: string): Promise<{
        appearance: {
            theme: string;
            fontSize: string;
        };
        notifications: {
            email: boolean;
            push: boolean;
        };
        video: {
            backgroundBlur: boolean;
            noiseCancellation: boolean;
            autoMute: boolean;
        };
    }>;
    deleteAccount(userId: string): Promise<void>;
}
