import dayjs from 'dayjs';
import { db, objectId } from '../db/mongo.js';


export async function newEntry (req, res) {
	const entry = res.locals.register;
	const user = res.locals.user;

	try {
		await db.collection('cashflow').insertOne({ ...entry, date: { day: dayjs().date(), month: (dayjs().month() + 1), year: dayjs().year() }, userId: new objectId(user.userId) });
		res.sendStatus(201);
	} catch (error) {
		console.error(error);
		res.sendStatus(500);
	}
};