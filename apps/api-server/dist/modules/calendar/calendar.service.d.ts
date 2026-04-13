import { CalMeeting } from "./entities/cal-meeting.entity";
export declare class CalendarService {
    private get repo();
    getAll(startDate: string, endDate: string): Promise<CalMeeting[]>;
    create(data: any): Promise<CalMeeting>;
    update(id: string, data: any): Promise<CalMeeting>;
    delete(id: string): Promise<{
        success: boolean;
    }>;
}
