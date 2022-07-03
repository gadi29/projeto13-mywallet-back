import { Router } from 'express';
import { getRegisters, getRegister, editRegister, deleteRegister } from '../controllers/registersController.js';
import editRegistersValidateMiddleware from '../middlewares/editRegistersValidateMiddleware.js';

const router = Router();

router.get('/registers/:date', getRegisters);
router.get('/registers/:id', getRegister);
router.put('/registers/:id', editRegistersValidateMiddleware, editRegister);
router.delete('/registers/:id', deleteRegister);

export default router;