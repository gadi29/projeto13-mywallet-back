import dotenv from 'dotenv';
import joi from 'joi';
import { MongoClient, ObjectId } from 'mongodb';

dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;

mongoClient.connect().then(() => {
	db = mongoClient.db(process.env.MONGO_DATABASE);
});


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

		const thisExit = await db.collection('cash-flow').insertOne({ ...exit, date: Date.now(), userId: new ObjectId(user.userId) });
		res.send(thisExit.insertedId).status(201);
	} catch (error) {
		console.error(error);
		res.sendStatus(500);
	}
};

export async function editExit (req, res) {
	const { id } = req.params;
	const { authorization } = req.headers;
	const token = authorization?.replace('Bearer ', '');
	const newExit = req.body;

	const exitSchema = joi.object({
		value: joi.number().required(),
		description: joi.string().trim().required()
	})

	const validateNewExit = exitSchema.validate(newExit);
	if (validateNewExit.error) {
		return res.sendStatus(422);
	}

	const { value, description } = newExit;

	try {
		const user = await db.collection('sessions').findOne({ token });
		if (!user) {
			return res.sendStatus(401);
		}

		const exit = await db.collection('cash-flow').findOne({ _id: new ObjectId(id) });
		if (!exit) {
			return res.sendStatus(404);
		}

		await db.collection('cash-flow').updateOne({ 
			_id: exit._id
		 }, { $set: { ...exit, value, description } });
		 
		 res.sendStatus(200);
	} catch (error) {
		console.error(error);
		res.sendStatus(500);
	}
};

export async function deleteExit (req, res) {
	const { id } = req.params;
	const { authorization } = req.headers;
	const token = authorization?.replace('Bearer ', '');

	try {
		const user = await db.collection('sessions').findOne({ token });
		if (!user) {
			return res.sendStatus(401);
		}

		const exit = await db.collection('cash-flow').findOne({ _id: new ObjectId(id) });
		if (!exit) {
			return res.sendStatus(404);
		}

		await db.collection('cash-flow').deleteOne({ _id: new ObjectId(id) });
		res.sendStatus(200);
	} catch (error) {
		console.error(error);
		res.sendStatus(500);
	}
};