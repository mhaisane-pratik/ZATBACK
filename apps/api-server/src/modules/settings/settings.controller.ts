import { Request, Response } from "express";
import { SettingsService } from "./settings.service";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });
const service = new SettingsService();

export class SettingsController {
  get = async (req: any, res: Response) => {
    const data = await service.get(req.user.id);
    res.json(data);
  };

  updateProfile = async (req: any, res: Response) => {
    const data = await service.updateProfile(req.user.id, req.body);
    res.json(data);
  };

  updateSection = async (req: any, res: Response) => {
    const result = await service.updateSettings(
      req.user.id,
      req.params.section,
      req.body
    );
    res.json(result);
  };

  uploadAvatar = [
    upload.single("avatar"),
    async (req: any, res: Response) => {
      const url = await service.uploadAvatar(req.user.id, req.file);
      res.json({ avatarUrl: url });
    },
  ];

  deleteAvatar = async (req: any, res: Response) => {
    await service.deleteAvatar(req.user.id);
    res.json({ success: true });
  };

  changePassword = async (req: any, res: Response) => {
    await service.changePassword(
      req.user.id,
      req.body.currentPassword,
      req.body.newPassword
    );
    res.json({ success: true });
  };

  reset = async (req: any, res: Response) => {
    const s = await service.resetSettings(req.user.id);
    res.json({ settings: s });
  };

  deleteAccount = async (req: any, res: Response) => {
    await service.deleteAccount(req.user.id);
    res.json({ success: true });
  };
}
