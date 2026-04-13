"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeetingController = void 0;
const meeting_service_1 = require("./meeting.service");
class MeetingController {
    constructor() {
        this.meetingService = new meeting_service_1.MeetingService();
    }
    async createMeeting(req, res, next) {
        try {
            const result = await this.meetingService.create(req.body);
            res.status(201).json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async getMeeting(req, res, next) {
        try {
            const result = await this.meetingService.findById(req.params.id);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.MeetingController = MeetingController;
//# sourceMappingURL=meeting.controller.js.map