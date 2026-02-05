import { AppDataSource } from "../../config/data-source";
import { CalMeeting } from "./entities/cal-meeting.entity";
import { Between } from "typeorm";

export class CalendarService {
  private get repo() {
    return AppDataSource.getRepository(CalMeeting);
  }

  /* =========================
     GET MEETINGS (RANGE)
  ========================= */
  async getAll(startDate: string, endDate: string) {
    return this.repo.find({
      where: {
        date: Between(startDate, endDate),
      },
      order: {
        start_time: "ASC",
      },
    });
  }

  /* =========================
     CREATE MEETING
  ========================= */
  async create(data: any) {
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

      // ✅ CORRECT TYPES
      date: start.toISOString().split("T")[0], // YYYY-MM-DD
      start_time: start, // TIMESTAMPTZ
      end_time: end,     // TIMESTAMPTZ
    });

    return await this.repo.save(meeting);
  }

  /* =========================
     UPDATE MEETING (SAFE)
  ========================= */
  async update(id: string, data: any) {
    const meeting = await this.repo.findOneBy({ id });
    if (!meeting) {
      throw new Error("Meeting not found");
    }

    // ✅ SAFE FIELD UPDATES
    if (data.title !== undefined) meeting.title = data.title;
    if (data.description !== undefined)
      meeting.description = data.description;
    if (data.color !== undefined) meeting.color = data.color;
    if (data.status !== undefined) meeting.status = data.status;

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

  /* =========================
     DELETE MEETING
  ========================= */
  async delete(id: string) {
    const result = await this.repo.delete(id);
    if (result.affected === 0) {
      throw new Error("Meeting not found");
    }
    return { success: true };
  }
}
