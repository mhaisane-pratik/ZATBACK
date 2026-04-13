"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSettings = void 0;
const typeorm_1 = require("typeorm");
let UserSettings = class UserSettings {
};
exports.UserSettings = UserSettings;
__decorate([
    (0, typeorm_1.PrimaryColumn)("uuid"),
    __metadata("design:type", String)
], UserSettings.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "jsonb" }),
    __metadata("design:type", Object)
], UserSettings.prototype, "profile", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "jsonb" }),
    __metadata("design:type", Object)
], UserSettings.prototype, "notifications", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "jsonb" }),
    __metadata("design:type", Object)
], UserSettings.prototype, "video", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "jsonb" }),
    __metadata("design:type", Object)
], UserSettings.prototype, "meeting", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "jsonb" }),
    __metadata("design:type", Object)
], UserSettings.prototype, "appearance", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "jsonb" }),
    __metadata("design:type", Object)
], UserSettings.prototype, "security", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "jsonb" }),
    __metadata("design:type", Object)
], UserSettings.prototype, "shortcuts", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "jsonb" }),
    __metadata("design:type", Object)
], UserSettings.prototype, "integrations", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], UserSettings.prototype, "updated_at", void 0);
exports.UserSettings = UserSettings = __decorate([
    (0, typeorm_1.Entity)("user_settings")
], UserSettings);
//# sourceMappingURL=user-settings.entity.js.map