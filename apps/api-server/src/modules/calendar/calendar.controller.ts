import { Request, Response } from "express";
import { CalendarService } from "./calendar.service";

export class CalendarController {
  private service = new CalendarService();

  getAll = async (req: Request, res: Response) => {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
      return res.status(400).json({ error: "Missing date range" });
    }
    const data = await this.service.getAll(
      startDate as string,
      endDate as string
    );
    res.json(data);
  };

  create = async (req: Request, res: Response) => {
    const meeting = await this.service.create(req.body);
    res.status(201).json(meeting);
  };

  update = async (req: Request, res: Response) => {
    const meeting = await this.service.update(req.params.id, req.body);
    res.json(meeting);
  };

  delete = async (req: Request, res: Response) => {
    await this.service.delete(req.params.id);
    res.json({ success: true });
  };
}
