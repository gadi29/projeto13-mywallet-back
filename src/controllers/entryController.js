import dotenv from 'dotenv';
import joi from 'joi';
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

		const thisEntry = await db.collection('cash-flow').insertOne({ ...entry, date: Date.now(), userId: new ObjectId(user.userId) });
		res.send(thisEntry.insertedId).status(201);
	} catch (error) {
		console.error(error);
		res.sendStatus(500);
	}
};

export async function editEntry (req, res) {
	const { id } = req.params;
	const { authorization } = req.headers;
	const token = authorization?.replace('Bearer ', '');
	const newEntry = req.body;

	const entrySchema = joi.object({
		value: joi.number().required(),
		description: joi.string().trim().required()
	})

	const validateNewEntry = entrySchema.validate(newEntry);
	if (validateNewEntry.error) {
		return res.sendStatus(422);
	}

	const { value, description } = newEntry;

	try {
		const user = await db.collection('sessions').findOne({ token });
		if (!user) {
			return res.sendStatus(401);
		}

		const entry = await db.collection('cash-flow').findOne({ _id: new ObjectId(id) });
		if (!entry) {
			return res.sendStatus(404);
		}

		await db.collection('cash-flow').updateOne({ 
			_id: entry._id
		 }, { $set: { ...entry, value, description } });
		 
		 res.sendStatus(200);
	} catch (error) {
		console.error(error);
		res.sendStatus(500);
	}
};

export async function deleteEntry (req, res) {
	const { id } = req.params;
	const { authorization } = req.headers;
	const token = authorization?.replace('Bearer ', '');

	try {
		const user = await db.collection('sessions').findOne({ token });
		if (!user) {
			return res.sendStatus(401);
		}

		const entry = await db.collection('cash-flow').findOne({ _id: new ObjectId(id) });
		if (!entry) {
			return res.sendStatus(404);
		}

		await db.collection('cash-flow').deleteOne({ _id: new ObjectId(id) });
		res.sendStatus(200);
	} catch (error) {
		console.error(error);
		res.sendStatus(500);
	}
};