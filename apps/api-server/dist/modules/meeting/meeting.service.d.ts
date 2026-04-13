export declare class MeetingService {
    create(data: any): Promise<{
        id: string;
        joinUrl: string;
    }>;
    findById(id: string): Promise<{
        id: string;
        title: string;
        participants: any[];
    }>;
}
