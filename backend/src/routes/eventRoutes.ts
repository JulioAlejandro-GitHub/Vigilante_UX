import { Router } from 'express';
import { getEvents, getEventsGrouped, updateEventSubject, deleteEvent } from '../controllers/eventController';

const router = Router();

router.get('/', getEvents);
router.get('/grouped', getEventsGrouped);
router.put('/:id/subject', updateEventSubject);
router.delete('/:id', deleteEvent);

export default router;
