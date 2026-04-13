"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const settings_controller_1 = require("./settings.controller");
const c = new settings_controller_1.SettingsController();
const router = (0, express_1.Router)();
router.get("/settings", c.get);
router.patch("/settings/profile", c.updateProfile);
router.patch("/settings/:section", c.updateSection);
router.post("/settings/avatar", ...c.uploadAvatar);
router.delete("/settings/avatar", c.deleteAvatar);
router.post("/settings/change-password", c.changePassword);
router.post("/settings/reset", c.reset);
router.delete("/settings", c.deleteAccount);
exports.default = router;
//# sourceMappingURL=settings.routes.js.map