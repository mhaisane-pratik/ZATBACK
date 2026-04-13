import { Request, Response, NextFunction } from 'express';
export declare class MeetingController {
    private meetingService;
    constructor();
    createMeeting(req: Request, res: Response, next: NextFunction): Promise<void>;
    getMeeting(req: Request, res: Response, next: NextFunction): Promise<void>;
}
