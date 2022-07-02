import editRegistersSchema from '../schemas/editRegistersSchema.js';

async function editRegistersValidateMiddleware (req, res, next) {
  const newRegister = req.body;

	const validateNewRegister = editRegistersSchema.validate(newRegister);
	if (validateNewRegister.error) {
		return res.sendStatus(422);
	}

  next();
}

export default editRegistersValidateMiddleware;