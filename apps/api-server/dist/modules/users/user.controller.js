"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_service_1 = require("./user.service");
class UserController {
    constructor() {
        this.userService = new user_service_1.UserService();
    }
    async getProfile(req, res, next) {
        try {
            res.json({ id: 1, name: 'Admin', role: 'HOST' });
        }
        catch (error) {
            next(error);
        }
    }
    async updateProfile(req, res, next) {
        try {
            res.json({ message: 'Profile updated' });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map