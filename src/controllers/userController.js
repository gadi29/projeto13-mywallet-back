import dotenv from 'dotenv';
import { MongoClient, ObjectId } from 'mongodb';

dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;

mongoClient.connect().then(() => {
	db = mongoClient.db(process.env.MONGO_DATABASE);
});


export async function getUser (req, res) {
	const { authorization } = req.headers;
	const token = authorization?.replace('Bearer ', '');

	try {
		const user = await db.collection('sessions').findOne({ token });
		if (!user) {
			return res.sendStatus(401);
		}

		const { name } = await db.collection('users').findOne({ _id: new ObjectId(user.userId) });
		res.send(name);
	} catch (error) {
		console.error(error);
		res.sendStatus(500);
	}
};