import * as Joi from '@hapi/joi';
const JoiObjectId = require('joi-objectid');
const myObjectId = JoiObjectId(Joi);

export const GetProgressInfoSchema = Joi.object({
  timePeriod: Joi.string()
    .required()
    .valid('week', 'month', 'year', 'all'),
  routineId: myObjectId().required()
});

export const CreateProgressInfoSchema = Joi.object({
  weight: Joi.array()
    .items(Joi.number())
    .required(),
  sets: Joi.number().required(),
  reps: Joi.array()
    .items(Joi.number())
    .required()
});

export const CreateInitialProgressInfoSchema = Joi.object({
  reps: Joi.array()
    .items(Joi.number())
    .required(),
  sets: Joi.number().required(),
  weight: Joi.array()
    .items(Joi.number())
    .optional()
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
