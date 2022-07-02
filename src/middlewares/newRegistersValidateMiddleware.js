import registerSchema from '../schemas/newRegistersSchemas.js';

async function newRegistersValidateMiddleware (req, res, next) {
	const register = req.body;

  const validateRegister = registerSchema.validate(register);
  if (validateRegister.error) {
    return res.sendStatus(422);
  }

  res.locals.register = register;

  next();
}

export default newRegistersValidateMiddleware;