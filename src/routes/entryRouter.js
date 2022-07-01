import { Router } from 'express';
import { newEntry } from '../controllers/entryController.js';

const router = Router();

router.post('/entry', newEntry);

export default router;