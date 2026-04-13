"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsController = void 0;
const settings_service_1 = require("./settings.service");
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
const service = new settings_service_1.SettingsService();
class SettingsController {
    constructor() {
        this.get = async (req, res) => {
            const data = await service.get(req.user.id);
            res.json(data);
        };
        this.updateProfile = async (req, res) => {
            const data = await service.updateProfile(req.user.id, req.body);
            res.json(data);
        };
        this.updateSection = async (req, res) => {
            const result = await service.updateSettings(req.user.id, req.params.section, req.body);
            res.json(result);
        };
        this.uploadAvatar = [
            upload.single("avatar"),
            async (req, res) => {
                const url = await service.uploadAvatar(req.user.id, req.file);
                res.json({ avatarUrl: url });
            },
        ];
        this.deleteAvatar = async (req, res) => {
            await service.deleteAvatar(req.user.id);
            res.json({ success: true });
        };
        this.changePassword = async (req, res) => {
            await service.changePassword(req.user.id, req.body.currentPassword, req.body.newPassword);
            res.json({ success: true });
        };
        this.reset = async (req, res) => {
            const s = await service.resetSettings(req.user.id);
            res.json({ settings: s });
        };
        this.deleteAccount = async (req, res) => {
            await service.deleteAccount(req.user.id);
            res.json({ success: true });
        };
    }
}
exports.SettingsController = SettingsController;
//# sourceMappingURL=settings.controller.js.map