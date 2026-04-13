"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsService = void 0;
const data_source_1 = require("../../config/data-source");
const settings_entity_1 = require("./settings.entity");
const defaultSetting_1 = require("./defaultSetting");
const bcrypt_1 = __importDefault(require("bcrypt"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class SettingsService {
    constructor() {
        this.repo = data_source_1.AppDataSource.getRepository(settings_entity_1.UserSettings);
        this.avatarDir = path_1.default.join(process.cwd(), "uploads/avatars");
        if (!fs_1.default.existsSync(this.avatarDir)) {
            fs_1.default.mkdirSync(this.avatarDir, { recursive: true });
        }
    }
    async get(userId) {
        let user = await this.repo.findOneBy({ user_id: userId });
        if (!user) {
            user = await this.repo.save({
                user_id: userId,
                settings: defaultSetting_1.defaultSettings,
            });
        }
        return user;
    }
    async updateProfile(userId, data) {
        await this.repo.update({ user_id: userId }, data);
        return this.get(userId);
    }
    async updateSettings(userId, section, data) {
        const user = await this.get(userId);
        const updated = {
            ...user.settings,
            [section]: data,
        };
        await this.repo.update({ user_id: userId }, { settings: updated });
        return updated[section];
    }
    async uploadAvatar(userId, file) {
        const ext = path_1.default.extname(file.originalname);
        const filename = `avatar_${userId}_${Date.now()}${ext}`;
        const fullPath = path_1.default.join(this.avatarDir, filename);
        fs_1.default.writeFileSync(fullPath, file.buffer);
        const avatarUrl = `/uploads/avatars/${filename}`;
        await this.repo.update({ user_id: userId }, { avatar: avatarUrl });
        return avatarUrl;
    }
    async deleteAvatar(userId) {
        const user = await this.get(userId);
        if (user.avatar) {
            const filePath = path_1.default.join(process.cwd(), user.avatar);
            if (fs_1.default.existsSync(filePath))
                fs_1.default.unlinkSync(filePath);
        }
        await this.repo.update({ user_id: userId }, { avatar: null });
    }
    async changePassword(userId, current, next) {
        const user = await this.get(userId);
        if (!user.password_hash)
            throw new Error("No password set");
        const ok = await bcrypt_1.default.compare(current, user.password_hash);
        if (!ok)
            throw new Error("Wrong password");
        const hash = await bcrypt_1.default.hash(next, 10);
        await this.repo.update({ user_id: userId }, { password_hash: hash });
    }
    async resetSettings(userId) {
        await this.repo.update({ user_id: userId }, { settings: defaultSetting_1.defaultSettings });
        return defaultSetting_1.defaultSettings;
    }
    async deleteAccount(userId) {
        const user = await this.get(userId);
        if (user.avatar) {
            const filePath = path_1.default.join(process.cwd(), user.avatar);
            if (fs_1.default.existsSync(filePath))
                fs_1.default.unlinkSync(filePath);
        }
        await this.repo.delete({ user_id: userId });
    }
}
exports.SettingsService = SettingsService;
//# sourceMappingURL=settings.service.js.map