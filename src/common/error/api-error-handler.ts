import { ZodError } from "zod";
import { NextResponse } from "next/server";
import { AppError } from ".";


export class ApiErrorHandler {

  public static handler(error: any) {

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

    console.log(error); // [ToDo] replace by logger

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