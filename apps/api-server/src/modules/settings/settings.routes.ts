import { Router } from "express";
import { SettingsController } from "./settings.controller";

const c = new SettingsController();
const router = Router();

router.get("/settings", c.get);
router.patch("/settings/profile", c.updateProfile);
router.patch("/settings/:section", c.updateSection);
router.post("/settings/avatar", ...c.uploadAvatar);
router.delete("/settings/avatar", c.deleteAvatar);
router.post("/settings/change-password", c.changePassword);
router.post("/settings/reset", c.reset);
router.delete("/settings", c.deleteAccount);

export default router;
