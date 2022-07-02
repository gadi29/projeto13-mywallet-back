import { Router } from 'express';
import { newEntry } from '../controllers/entryController.js';
import newRegistersValidateMiddleware from '../middlewares/newRegistersValidateMiddleware.js';

const router = Router();

router.post('/entry', newRegistersValidateMiddleware, newEntry);

export default router;