import * as Joi from '@hapi/joi';

export const CreateExerciseSchema = Joi.object({
  name: Joi.string().required(),
  bodyPart: Joi.string().required(),
  type: Joi.string()
    .required()
    .valid('compound', 'isolation')
});
