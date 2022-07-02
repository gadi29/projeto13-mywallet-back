import joi from 'joi';

const userSchema = joi.object({
  name: joi.string().pattern(/[a-zA-Z\u00C0-\u00FF]+/i).required(),
  email: joi.string().email().required(),
  password: joi.string().required() // pattern
});

export default userSchema;