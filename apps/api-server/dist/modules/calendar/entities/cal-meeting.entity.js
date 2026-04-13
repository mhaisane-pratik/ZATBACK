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
exports.CalMeeting = void 0;
const typeorm_1 = require("typeorm");
let CalMeeting = class CalMeeting {
};
exports.CalMeeting = CalMeeting;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], CalMeeting.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CalMeeting.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], CalMeeting.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "date" }),
    __metadata("design:type", String)
], CalMeeting.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamptz" }),
    __metadata("design:type", Date)
], CalMeeting.prototype, "start_time", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamptz" }),
    __metadata("design:type", Date)
], CalMeeting.prototype, "end_time", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: "#3b82f6" }),
    __metadata("design:type", String)
], CalMeeting.prototype, "color", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: "scheduled" }),
    __metadata("design:type", String)
], CalMeeting.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "timestamptz" }),
    __metadata("design:type", Date)
], CalMeeting.prototype, "created_at", void 0);
exports.CalMeeting = CalMeeting = __decorate([
    (0, typeorm_1.Entity)({ name: "cal_meetings" })
], CalMeeting);
//# sourceMappingURL=cal-meeting.entity.js.map