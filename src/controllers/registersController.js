import joi from 'joi';
import { db, objectId } from '../db/mongo.js';


export async function getRegisters (req, res) {
	const { authorization } = req.headers;
	const token = authorization?.replace('Bearer ', '');

	try {
		const user = await db.collection('sessions').findOne({ token });
		if (!user) {
			return res.sendStatus(401);
		}

		const cashFlow = await db.collection('cashflow').find({ userId: new objectId(user.userId) }, { userId: 0 }).toArray();
		res.send(cashFlow).status(200);
	} catch (error) {
		console.error(error);
		res.sendStatus(500);
	}
};

export async function getRegister (req, res) {
	const { id } = req.params;

	try {
		const register = await db.collection('cashflow').findOne({ _id: new objectId(id) }, { userId: 0 });
		res.send(register).status(200);
	} catch (error) {
		console.error(error);
		res.sendStatus(500);
	}
};

export async function editRegister (req, res) {
	const { id } = req.params;
	const { authorization } = req.headers;
	const token = authorization?.replace('Bearer ', '');
	const newRegister = req.body;

	const registerSchema = joi.object({
		value: joi.number().required(),
		description: joi.string().trim().required()
	})

	const validateNewRegister = registerSchema.validate(newRegister);
	if (validateNewRegister.error) {
		return res.sendStatus(422);
	}

	const { value, description } = newRegister;

	try {
		const user = await db.collection('sessions').findOne({ token });
		if (!user) {
			return res.sendStatus(401);
		}

		const register = await db.collection('cashflow').findOne({ _id: new objectId(id) });
		if (!register) {
			return res.sendStatus(404);
		}

		await db.collection('cashflow').updateOne({ 
			_id: register._id
		 }, { $set: { ...register, value, description } });
		 
		 res.sendStatus(200);
	} catch (error) {
		console.error(error);
		res.sendStatus(500);
	}
};

export async function deleteRegister (req, res) {
	const { id } = req.params;

	try {
		const register = await db.collection('cashflow').findOne({ _id: new objectId(id) });
		if (!register) {
			return res.sendStatus(404);
		}

		await db.collection('cashflow').deleteOne({ _id: new objectId(id) });
		res.sendStatus(200);
	} catch (error) {
		console.error(error);
		res.sendStatus(500);
	}
};