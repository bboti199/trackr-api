import * as Joi from '@hapi/joi';

export const RegisterUserSchema = Joi.object({
  fid: Joi.string().required(),
  username: Joi.string().required()
});
