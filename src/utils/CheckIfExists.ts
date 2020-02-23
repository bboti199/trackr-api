import { Model } from 'mongoose';

export const checkIfExists = async (
  model: Model<any>,
  objects: Array<string>
): Promise<boolean> => {
  const check = await _checkIfExists(model, objects);

  return check.filter(v => v).length === objects.length;
};

const _checkIfExists = (
  model: Model<any>,
  objects: Array<string>
): Promise<boolean[]> => {
  return Promise.all(
    objects.map(async (object: string) => {
      const objectExists = await model.exists({ _id: object });
      return objectExists;
    })
  );
};
