import * as Joi from '@hapi/joi';

export const CreateProgressInfoSchema = Joi.object({
  weight: Joi.number().required(),
  sets: Joi.number().required(),
  reps: Joi.number().required()
});

export const CreateInitialProgressInfoSchema = Joi.object({
  sets: Joi.number().required(),
  reps: Joi.number().required(),
  weight: Joi.number().optional()
});

export const CreateRoutineDataSchema = Joi.object({
  exercise: Joi.string().required(),
  progress: Joi.array()
    .items(CreateInitialProgressInfoSchema)
    .required()
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

export const UpdateRoutineSchema = Joi.object({
  name: Joi.string()
    .max(255)
    .optional(),
  description: Joi.string().optional()
});

export const UpdateRoutineDataSchema = Joi.array().items(
  Joi.object({
    exercise: Joi.string().required(),
    progress: CreateProgressInfoSchema.required()
  })
);
