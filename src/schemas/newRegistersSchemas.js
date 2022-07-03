import joi from 'joi';

const registerSchema = joi.object({
  type: joi.string().valid('entry', 'exit').required(),
  value: joi.number().required(),
  description: joi.string().trim().required(),
  date: joi.date().required()
});

export default registerSchema;