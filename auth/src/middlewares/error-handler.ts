import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'express-validator';
import { CustomError } from '../errors/custom-error';

function isFieldValidationError(
  error: ValidationError
): error is ValidationError & { path: string } {
  return 'path' in error && 'msg' in error;
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }

  res.status(400).send({
    errors: [{ message: 'Something went wrong' }],
  });
};
