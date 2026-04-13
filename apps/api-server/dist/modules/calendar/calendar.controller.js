"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalendarController = void 0;
const calendar_service_1 = require("./calendar.service");
class CalendarController {
    constructor() {
        this.service = new calendar_service_1.CalendarService();
        this.getAll = async (req, res) => {
            const { startDate, endDate } = req.query;
            if (!startDate || !endDate) {
                return res.status(400).json({ error: "Missing date range" });
            }
            const data = await this.service.getAll(startDate, endDate);
            res.json(data);
        };
        this.create = async (req, res) => {
            const meeting = await this.service.create(req.body);
            res.status(201).json(meeting);
        };
        this.update = async (req, res) => {
            const meeting = await this.service.update(req.params.id, req.body);
            res.json(meeting);
        };
        this.delete = async (req, res) => {
            await this.service.delete(req.params.id);
            res.json({ success: true });
        };
    }
}
exports.CalendarController = CalendarController;
//# sourceMappingURL=calendar.controller.js.map