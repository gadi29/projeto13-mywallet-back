import { db } from '../db/mongo.js';

async function validateUser (req, res, next) {

  const { authorization } = req.headers;
  const token = authorization?.replace('Bearer ', '');

  const user = await db.collection('sessions').findOne({ token });
  if (!user) {
    return res.sendStatus(401);
  }

  res.locals.user = user;

  next();
}

export default validateUser;