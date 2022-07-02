import joi from 'joi';
import dayjs from 'dayjs';
import { db, objectId } from '../db/mongo.js';


export async function newEntry (req, res) {
	const entry = req.body;
	const user = res.locals.user;

	const entrySchema = joi.object({
		type: joi.string().valid('entry').required(),
		value: joi.number().required(),
		description: joi.string().trim().required()
	})

	const validateEntry = entrySchema.validate(entry);
	if (validateEntry.error) {
		return res.sendStatus(422);
	}

	try {
		const thisEntry = await db.collection('cashflow').insertOne({ ...entry, date: { day: dayjs().date(), month: (dayjs().month() + 1), year: dayjs().year() }, userId: new objectId(user.userId) });
		res.sendStatus(201);
	} catch (error) {
		console.error(error);
		res.sendStatus(500);
	}
};