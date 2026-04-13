"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeetingService = void 0;
class MeetingService {
    async create(data) {
        return { id: 'meeting-123', joinUrl: 'https://meet.primezat.com/meeting-123' };
    }
    async findById(id) {
        return { id, title: 'Project Discussion', participants: [] };
    }
}
exports.MeetingService = MeetingService;
//# sourceMappingURL=meeting.service.js.map