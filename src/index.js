import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Controllers
import { signUp, signIn } from './controllers/authControllers.js';
import { getCashFlow } from './controllers/cashController.js';
import { newEntry, editEntry, deleteEntry } from './controllers/entryController.js';
import { newExit, editExit, deleteExit } from './controllers/exitController.js';

dotenv.config();
const app = express();
app.use(json());
app.use(cors());


// Authentication routes
app.post('/sign-up', signUp);
app.post('/sign-in', signIn);

// Cash route
app.get('/cash-flow', getCashFlow);

// Entries routes
app.post('/entry', newEntry);
app.put('/entry/:id', editEntry);
app.delete('/entry/:id', deleteEntry);

// Exits routes
app.post('/exit', newExit);
app.put('/exit/:id', editExit);
app.delete('/exit/:id', deleteExit);


const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});