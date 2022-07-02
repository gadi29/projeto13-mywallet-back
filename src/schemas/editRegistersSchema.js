import joi from 'joi';

const editRegistersSchema = joi.object({
  value: joi.number().required(),
  description: joi.string().trim().required()
});

export default editRegistersSchema;