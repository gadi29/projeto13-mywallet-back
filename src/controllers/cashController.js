import dotenv from 'dotenv';
import { MongoClient, ObjectId } from 'mongodb';

dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;

mongoClient.connect().then(() => {
	db = mongoClient.db(process.env.MONGO_DATABASE);
});


export async function getCashFlow (req, res) {
	const { authorization } = req.headers;
	const token = authorization?.replace('Bearer ', '');

	try {
		const user = await db.collection('sessions').findOne({ token });
		if (!user) {
			return res.sendStatus(401);
		}

		const cashFlow = await db.collection('cashflow').find({ userId: new ObjectId(user.userId) }, { userId: 0 }).toArray();
		res.send(cashFlow).status(200);
	} catch (error) {
		console.error(error);
		res.sendStatus(500);
	}
};