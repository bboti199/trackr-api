import Joi = require('@hapi/joi');

export const runValidation = (
  schema: Joi.ObjectSchema,
  data: any
): string | null => {
  const { error } = schema.validate(data, { abortEarly: false });

  if (error) {
    const errors: string[] = [];

    error.details.map(errDetail => {
      errors.push(errDetail.message);
    });

    const errMessage = errors.join(',');

    return errMessage;
  } else {
    return null;
  }
};
