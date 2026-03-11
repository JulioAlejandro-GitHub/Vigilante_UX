import { Router } from 'express';
import { getEvents, updateEventSubject, deleteEvent } from '../controllers/eventController';

const router = Router();

router.get('/', getEvents);
router.put('/:id/subject', updateEventSubject);
router.delete('/:id', deleteEvent);

export default router;
