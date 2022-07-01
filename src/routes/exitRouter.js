import { Router } from 'express';
import { newExit } from '../controllers/exitController.js';

const router = Router();

router.post('/exit', newExit);

export default router;