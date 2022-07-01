import joi from 'joi';
import dayjs from 'dayjs';
import { db, objectId } from '../db/mongo.js';


export async function newExit (req, res) {
	const exit = req.body;
	const { authorization } = req.headers;
	const token = authorization?.replace('Bearer ', '');

	const exitSchema = joi.object({
		type: joi.string().valid('exit').required(),
		value: joi.number().required(),
		description: joi.string().trim().required()
	})

	const validateExit = exitSchema.validate(exit);
	if (validateExit.error) {
		return res.sendStatus(422);
	}

	try {
		const user = await db.collection('sessions').findOne({ token });
		if (!user) {
			return res.sendStatus(401);
		}

		const thisExit = await db.collection('cashflow').insertOne({ ...exit, date: { day: dayjs().date(), month: (dayjs().month() + 1), year: dayjs().year() }, userId: new objectId(user.userId) });
		res.send(thisExit.insertedId).status(201);
	} catch (error) {
		console.error(error);
		res.sendStatus(500);
	}
};