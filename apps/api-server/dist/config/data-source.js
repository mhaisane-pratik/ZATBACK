"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("dotenv/config");
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const cal_meeting_entity_1 = require("../modules/calendar/entities/cal-meeting.entity");
const settings_entity_1 = require("../modules/settings/settings.entity");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
    synchronize: false,
    logging: true,
    entities: [
        cal_meeting_entity_1.CalMeeting,
        settings_entity_1.UserSettings,
    ],
    migrations: [],
    subscribers: [],
});
//# sourceMappingURL=data-source.js.map