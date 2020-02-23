import * as Joi from '@hapi/joi';

export const CreateProgressInfoSchema = Joi.object({
  weight: Joi.number().required(),
  sets: Joi.number().required(),
  reps: Joi.number().required()
});

export const CreateRoutineDataSchema = Joi.object({
  exercise: Joi.string().required(),
  progress: Joi.array().items(CreateProgressInfoSchema)
});

export const CreateRoutineSchema = Joi.object({
  name: Joi.string()
    .required()
    .max(255),
  description: Joi.string(),
  routineData: Joi.array()
    .items(CreateRoutineDataSchema)
    .required()
});
