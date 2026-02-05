import "dotenv/config";
import "reflect-metadata";
import { DataSource } from "typeorm";

// 📅 Calendar Entity
import { CalMeeting } from "../modules/calendar/entities/cal-meeting.entity";

// ⚙️ Settings Entity
import { UserSettings } from "../modules/settings/settings.entity";

export const AppDataSource = new DataSource({
  type: "postgres",

  // Supabase connection string
  url: process.env.DATABASE_URL,

  // ✅ REQUIRED for Supabase
  ssl: {
    rejectUnauthorized: false,
  },

  // ❌ NEVER true in Supabase production
  synchronize: false,

  logging: true,

  // ✅ REGISTER ENTITIES HERE
  entities: [
    CalMeeting,
    UserSettings,
  ],

  migrations: [],
  subscribers: [],
});
