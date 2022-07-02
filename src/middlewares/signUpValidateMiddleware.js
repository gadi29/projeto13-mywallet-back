import userSchema from '../schemas/signUpSchema.js';

async function signUpValidateMiddleware (req, res, next) {
  const user = req.body;

  const validateUser = userSchema.validate(user);
  if (validateUser.error) {
    return res.sendStatus(422);
  }

  res.locals.user = user;

  next();
}

export default signUpValidateMiddleware;