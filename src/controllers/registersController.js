import { db, objectId } from '../db/mongo.js';
import dayjs from 'dayjs';


export async function getRegisters (req, res) {
	const user = res.locals.user;
	const { date } = req.params;
	const monthRequired = `${date}`

	try {
		const cashFlow = await db.collection('cashflow').find({ userId: new objectId(user.userId) }, { userId: 0 }).toArray();
		const registers = cashFlow.filter(register => dayjs(register.date).format('MM-YYYY') === monthRequired);
		
		res.send(registers).status(200);
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
	const { value, description, date } = req.body;
	const { id } = req.params;

	try {
		const register = await db.collection('cashflow').findOne({ _id: new objectId(id) });
		if (!register) {
			return res.sendStatus(404);
		}

		await db.collection('cashflow').updateOne({ 
			_id: register._id
		 }, { $set: { ...register, value, description, date } });
		 
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