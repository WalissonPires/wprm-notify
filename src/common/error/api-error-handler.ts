import { NextResponse } from "next/server";
import { AppError } from ".";


export class ApiErrorHandler {

  public static handler(error: any) {

    if (AppError.is(error)) {

      const data = {
        message: error.message,
        details: error.details
      };

      return NextResponse.json(data, { status: 422 });
    }

    console.log(error); // [ToDo] replace by logger

    const data = new AppError('Ocorreu um erro desconhecido');
    return NextResponse.json(data, { status: 500 });
  }
}