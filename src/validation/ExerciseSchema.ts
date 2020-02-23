import * as Joi from '@hapi/joi';

export const CreateExerciseSchema = Joi.object({
  name: Joi.string().required(),
  bodyPart: Joi.string().required(),
  type: Joi.string()
    .required()
    .valid('compound', 'isolation')
});

export const UpdateExerciseSchema = Joi.object({
  name: Joi.string(),
  bodyPart: Joi.string(),
  type: Joi.string().valid('compound', 'isolation')
});
