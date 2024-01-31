import { ZodError } from "zod";
import { NextResponse } from "next/server";
import { NotAuthenticateError } from "./not-authenticate-error";
import { ILogger, LoggerFactory } from "../logger";
import { AppError } from ".";

export class ApiErrorHandler {

  private static _logger: ILogger;

  public static handler(error: any) {

    if (NotAuthenticateError.is(error)) {

      return NextResponse.json(null, { status: 401 });
    }


    if (AppError.is(error)) {

      const data: ResponseError = {
        message: error.message,
        details: error.details
      };

      return NextResponse.json(data, { status: 422 });
    }

    if (error instanceof ZodError) {

      const error2 = AppError.fromZodError(error);

      const data: ResponseError = {
        message: error2.message,
        details: error2.details
      };

      return NextResponse.json(data, { status: 422 });
    }

    if (!this._logger) {
      this._logger = new LoggerFactory().createLogger({
        scope: ApiErrorHandler.name
      });
    }

    this._logger.error(AppError.parse(error).message);

    const data: ResponseError = {
       message: 'Ocorreu um erro desconhecido',
       details: {}
    };

    return NextResponse.json(data, { status: 500 });
  }
}

interface ResponseError {
  message: string;
  details: Record<string, string[]>;
}