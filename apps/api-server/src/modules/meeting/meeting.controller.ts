import { Request, Response, NextFunction } from 'express';
import { MeetingService } from './meeting.service';

export class MeetingController {
    private meetingService: MeetingService;

    constructor() {
        this.meetingService = new MeetingService();
    }

    async createMeeting(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await this.meetingService.create(req.body);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }

    async getMeeting(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await this.meetingService.findById(req.params.id);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
}
