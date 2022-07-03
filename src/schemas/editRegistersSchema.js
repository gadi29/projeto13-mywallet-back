import joi from 'joi';

const editRegistersSchema = joi.object({
  value: joi.number().required(),
  description: joi.string().trim().required(),
  date: joi.date().required()
});

export default editRegistersSchema;