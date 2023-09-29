

export class AppError extends Error {

  public static parse(error: any) {

    if (error instanceof AppError)
      return error;

    const message = error?.message ?? 'Unknow error';

    return new AppError(message, {
      cause: error
    });
  }

  public static is(error: any): error is AppError {

    return error instanceof AppError;
  }
}