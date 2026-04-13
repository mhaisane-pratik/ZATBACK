"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModule = void 0;
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const router = (0, express_1.Router)();
const userController = new user_controller_1.UserController();
router.get('/me', (req, res, next) => userController.getProfile(req, res, next));
router.put('/me', (req, res, next) => userController.updateProfile(req, res, next));
exports.UserModule = router;
//# sourceMappingURL=user.module.js.map