"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeetingModule = void 0;
const express_1 = require("express");
const meeting_controller_1 = require("./meeting.controller");
const router = (0, express_1.Router)();
const meetingController = new meeting_controller_1.MeetingController();
router.post('/', (req, res, next) => meetingController.createMeeting(req, res, next));
router.get('/:id', (req, res, next) => meetingController.getMeeting(req, res, next));
exports.MeetingModule = router;
//# sourceMappingURL=meeting.module.js.map