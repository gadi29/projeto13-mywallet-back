import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';
import joi from 'joi';
import { v4 as uuid } from 'uuid';

dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;

mongoClient.connect().then(() => {
	db = mongoClient.db(process.env.MONGO_DATABASE);
});


export async function signUp (req, res) {
	const user = req.body;
	const userSchema = joi.object({
		name: joi.string().pattern(/[a-zA-Z\u00C0-\u00FF]+/i).required(),
		email: joi.string().email().required(),
		password: joi.string().required() // pattern
	});

	const validateUser = userSchema.validate(user);
	if (validateUser.error) {
		return res.sendStatus(422);
	}

	try {
		const existUser = await db.collection('users').findOne({ email: user.email });
		if (existUser) {
			return res.sendStatus(409);
		}

		const passwordHash = bcrypt.hashSync(user.password, 10);

		await db.collection('users').insertOne({ ...user, password: passwordHash });
		res.sendStatus(201);
	} catch (error) {
		console.error(error);
		res.sendStatus(500);
	}
};

export async function signIn (req, res) {
	const { email, password } = req.body;

	try {
		const user = await db.collection('users').findOne({ email });

		if (user && bcrypt.compareSync(password, user.password)) {
			const token = uuid();
	
			await db.collection('sessions').insertOne({ token, userId: user._id });
			res.send(token);
		} else {
			res.sendStatus(401);
		}
	} catch (error) {
		console.error(error);
		res.sendStatus(500);
	}
};