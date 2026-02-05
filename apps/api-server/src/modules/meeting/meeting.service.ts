export class MeetingService {
    async create(data: any) {
        return { id: 'meeting-123', joinUrl: 'https://meet.primezat.com/meeting-123' };
    }

    async findById(id: string) {
        return { id, title: 'Project Discussion', participants: [] };
    }
}
