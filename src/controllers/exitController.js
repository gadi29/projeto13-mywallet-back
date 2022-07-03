import { db, objectId } from '../db/mongo.js';


export async function newExit (req, res) {
	const exit = res.locals.register;
	const user = res.locals.user;

	try {
		const thisExit = await db.collection('cashflow').insertOne({ ...exit, userId: new objectId(user.userId) });
		res.send(thisExit.insertedId).status(201);
	} catch (error) {
		console.error(error);
		res.sendStatus(500);
	}
};