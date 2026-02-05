import { AppDataSource } from "../../config/data-source";
import { UserSettings } from "./settings.entity";
import { defaultSettings } from "./defaultSetting";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";

export class SettingsService {
  private repo = AppDataSource.getRepository(UserSettings);
  private avatarDir = path.join(process.cwd(), "uploads/avatars");

  constructor() {
    if (!fs.existsSync(this.avatarDir)) {
      fs.mkdirSync(this.avatarDir, { recursive: true });
    }
  }

  async get(userId: string) {
    let user = await this.repo.findOneBy({ user_id: userId });

    if (!user) {
      user = await this.repo.save({
        user_id: userId,
        settings: defaultSettings,
      });
    }

    return user;
  }

  async updateProfile(userId: string, data: any) {
    await this.repo.update({ user_id: userId }, data);
    return this.get(userId);
  }

  async updateSettings(userId: string, section: string, data: any) {
    const user = await this.get(userId);
    const updated = {
      ...user.settings,
      [section]: data,
    };

    await this.repo.update(
      { user_id: userId },
      { settings: updated }
    );

    return updated[section];
  }

  async uploadAvatar(userId: string, file: Express.Multer.File) {
    const ext = path.extname(file.originalname);
    const filename = `avatar_${userId}_${Date.now()}${ext}`;
    const fullPath = path.join(this.avatarDir, filename);

    fs.writeFileSync(fullPath, file.buffer);

    const avatarUrl = `/uploads/avatars/${filename}`;
    await this.repo.update({ user_id: userId }, { avatar: avatarUrl });

    return avatarUrl;
  }

  async deleteAvatar(userId: string) {
    const user = await this.get(userId);
    if (user.avatar) {
      const filePath = path.join(process.cwd(), user.avatar);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    await this.repo.update({ user_id: userId }, { avatar: null });
  }

  async changePassword(userId: string, current: string, next: string) {
    const user = await this.get(userId);

    if (!user.password_hash) throw new Error("No password set");

    const ok = await bcrypt.compare(current, user.password_hash);
    if (!ok) throw new Error("Wrong password");

    const hash = await bcrypt.hash(next, 10);
    await this.repo.update({ user_id: userId }, { password_hash: hash });
  }

  async resetSettings(userId: string) {
    await this.repo.update(
      { user_id: userId },
      { settings: defaultSettings }
    );
    return defaultSettings;
  }

  async deleteAccount(userId: string) {
    const user = await this.get(userId);
    if (user.avatar) {
      const filePath = path.join(process.cwd(), user.avatar);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    await this.repo.delete({ user_id: userId });
  }
}
