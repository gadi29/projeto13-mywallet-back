import { Router } from 'express';
import { newExit } from '../controllers/exitController.js';
import newRegistersValidateMiddleware from '../middlewares/newRegistersValidateMiddleware.js';

const router = Router();

router.post('/exit', newRegistersValidateMiddleware, newExit);

export default router;