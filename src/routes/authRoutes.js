import { Router } from 'express';
import { signUp, signIn } from '../controllers/authControllers.js';
import signUpValidateMiddleware from '../middlewares/signUpValidateMiddleware.js';

const router = Router();

router.post('/sign-up', signUpValidateMiddleware, signUp);
router.post('/sign-in', signIn);

export default router;