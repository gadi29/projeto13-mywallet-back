import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Controllers
import { signUp, signIn } from './controllers/authControllers.js';
import { getRegisters, getRegister, editRegister, deleteRegister } from './controllers/registersController.js';
import { newEntry } from './controllers/entryController.js';
import { newExit } from './controllers/exitController.js';

dotenv.config();
const app = express();
app.use(json());
app.use(cors());


// Authentication routes
app.post('/sign-up', signUp);
app.post('/sign-in', signIn);

// Registers routes
app.get('/registers', getRegisters);
app.get('/registers/:id', getRegister);
app.put('/registers/:id', editRegister);
app.delete('/registers/:id', deleteRegister);

// Entries routes
app.post('/entry', newEntry);

// Exits routes
app.post('/exit', newExit);


const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});