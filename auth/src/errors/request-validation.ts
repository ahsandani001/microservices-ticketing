import { CustomError } from './custom-error';
import { ValidationError } from 'express-validator';

export class RequestValidationError extends CustomError {
  statusCode = 400;
  constructor(public errors: ValidationError[]) {
    super('Invalid request parameters');

    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  isFieldValidationError(
    error: ValidationError
  ): error is ValidationError & { path: string } {
    return 'path' in error && 'msg' in error;
  }

  serializeErrors() {
    return this.errors.filter(this.isFieldValidationError).map((error) => {
      console.log('AUTH ERROR: ', { message: error.msg, field: error.path });
      return { message: error.msg, field: error.path };
    });
  }
}
