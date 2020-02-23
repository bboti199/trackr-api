import * as Joi from '@hapi/joi';
const JoiObjectId = require('joi-objectid');
const myObjectId = JoiObjectId(Joi);

export const CreateLogSchema = Joi.object({
  workout: myObjectId().required(),
  completed: Joi.boolean().required()
});

export const UpdateLogSchema = Joi.object({
  completed: Joi.boolean().optional()
});
