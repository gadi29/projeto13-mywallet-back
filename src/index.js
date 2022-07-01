import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import registersRoutes from './routes/registersRoutes.js';
import entryRouter from './routes/entryRouter.js';
import exitRouter from './routes/exitRouter.js';

dotenv.config();

const app = express();

app.use(json());
app.use(cors());

app.use(authRoutes);
app.use(registersRoutes);
app.use(entryRouter);
app.use(exitRouter);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));