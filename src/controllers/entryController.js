import dotenv from 'dotenv';
import joi from 'joi';
import dayjs from 'dayjs';
import { MongoClient, ObjectId } from 'mongodb';

dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;

mongoClient.connect().then(() => {
	db = mongoClient.db(process.env.MONGO_DATABASE);
});


export async function newEntry (req, res) {
	const entry = req.body;
	const { authorization } = req.headers;
	const token = authorization?.replace('Bearer ', '');

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
		const user = await db.collection('sessions').findOne({ token });
		if (!user) {
			return res.sendStatus(401);
		}

		const thisEntry = await db.collection('cashflow').insertOne({ ...entry, date: { day: dayjs().date(), month: (dayjs().month() + 1), year: dayjs().year() }, userId: new ObjectId(user.userId) });
		res.sendStatus(201);
	} catch (error) {
		console.error(error);
		res.sendStatus(500);
	}
};