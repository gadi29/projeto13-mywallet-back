import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { db } from '../db/mongo.js';

export async function signUp (req, res) {
	const user = res.locals.user;

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
		const { name } = user;

		if(!user) {
			return res.sendStatus(401);
		}

		if (bcrypt.compareSync(password, user.password)) {
			const token = uuid();
	
			await db.collection('sessions').insertOne({ token, userId: user._id });
			res.send({ name, token });
		} else {
			res.sendStatus(401);
		}
	} catch (error) {
		console.error(error);
		res.sendStatus(500);
	}
};