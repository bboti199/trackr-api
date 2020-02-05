import * as Joi from '@hapi/joi';

export const RegisterUserSchema = Joi.object({
  email: Joi.string()
    .email()
    .required(),
  password: Joi.string()
    .min(6)
    .required(),
  username: Joi.string()
    .alphanum()
    .required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  avatar: Joi.string()
});
