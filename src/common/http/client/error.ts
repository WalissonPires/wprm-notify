import { AppError } from "../../error";


export class HttpClientError extends AppError {

  public statusCode: number = 0;

  constructor(message: string, statusCode: number) {

    super(message);
    this.statusCode = statusCode;
  }

  public static is(error: any): error is HttpClientError {

    return error instanceof HttpClientError;
  }
}