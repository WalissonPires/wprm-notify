import { AppError } from ".";


export class NotAuthenticateError extends AppError {

  constructor() {
    super('User not authenticate');
  }

  public static is(error: any): error is NotAuthenticateError {

    return error instanceof NotAuthenticateError;
  }
}