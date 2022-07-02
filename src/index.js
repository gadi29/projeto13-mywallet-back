import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import registersRoutes from './routes/registersRoutes.js';
import entryRouter from './routes/entryRouter.js';
import exitRouter from './routes/exitRouter.js';
import validateUser from './middlewares/validateUser.js';

dotenv.config();

const app = express();

app.use(json());
app.use(cors());

app.use(authRoutes);
app.use(validateUser, registersRoutes);
app.use(validateUser, entryRouter);
app.use(validateUser, exitRouter);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));