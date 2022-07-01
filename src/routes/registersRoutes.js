import { Router } from 'express';
import { getRegisters, getRegister, editRegister, deleteRegister } from '../controllers/registersController.js';

const router = Router();

router.get('/registers', getRegisters);
router.get('/registers/:id', getRegister);
router.put('/registers/:id', editRegister);
router.delete('/registers/:id', deleteRegister);

export default router;