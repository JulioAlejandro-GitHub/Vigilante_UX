import { Router } from 'express';
import { getPersonas } from '../controllers/personaController';

const router = Router();

router.get('/', getPersonas);

export default router;
