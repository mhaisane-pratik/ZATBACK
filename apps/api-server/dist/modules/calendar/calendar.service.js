"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalendarService = void 0;
const data_source_1 = require("../../config/data-source");
const cal_meeting_entity_1 = require("./entities/cal-meeting.entity");
const typeorm_1 = require("typeorm");
class CalendarService {
    get repo() {
        return data_source_1.AppDataSource.getRepository(cal_meeting_entity_1.CalMeeting);
    }
    async getAll(startDate, endDate) {
        return this.repo.find({
            where: {
                date: (0, typeorm_1.Between)(startDate, endDate),
            },
            order: {
                start_time: "ASC",
            },
        });
    }
    async create(data) {
        const start = new Date(data.start_time);
        const end = new Date(data.end_time);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            throw new Error("Invalid start_time or end_time");
        }
        const meeting = this.repo.create({
            title: data.title,
            description: data.description || null,
            color: data.color || "#3b82f6",
            status: "scheduled",
            date: start.toISOString().split("T")[0],
            start_time: start,
            end_time: end,
        });
        return await this.repo.save(meeting);
    }
    async update(id, data) {
        const meeting = await this.repo.findOneBy({ id });
        if (!meeting) {
            throw new Error("Meeting not found");
        }
        if (data.title !== undefined)
            meeting.title = data.title;
        if (data.description !== undefined)
            meeting.description = data.description;
        if (data.color !== undefined)
            meeting.color = data.color;
        if (data.status !== undefined)
            meeting.status = data.status;
        if (data.start_time) {
            const start = new Date(data.start_time);
            if (isNaN(start.getTime())) {
                throw new Error("Invalid start_time");
            }
            meeting.start_time = start;
            meeting.date = start.toISOString().split("T")[0];
        }
        if (data.end_time) {
            const end = new Date(data.end_time);
            if (isNaN(end.getTime())) {
                throw new Error("Invalid end_time");
            }
            meeting.end_time = end;
        }
        return await this.repo.save(meeting);
    }
    async delete(id) {
        const result = await this.repo.delete(id);
        if (result.affected === 0) {
            throw new Error("Meeting not found");
        }
        return { success: true };
    }
}
exports.CalendarService = CalendarService;
//# sourceMappingURL=calendar.service.js.map