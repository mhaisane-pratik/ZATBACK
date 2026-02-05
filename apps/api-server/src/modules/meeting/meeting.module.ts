import { Router } from 'express';
import { MeetingController } from './meeting.controller';

const router = Router();
const meetingController = new MeetingController();

router.post('/', (req, res, next) => meetingController.createMeeting(req, res, next));
router.get('/:id', (req, res, next) => meetingController.getMeeting(req, res, next));

export const MeetingModule = router;
