import appError from "../utils/appError.js";

export const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false }); // collect all errors
    if (error) {
      throw new appError('Validation error',400);
    }
    next();
  };
};