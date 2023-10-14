import { ZodError } from "zod";

export class AppError extends Error {

  public details: Record<string, string[]>;

  constructor(message: string, details?: Record<string, string[]>, cause?: any) {
    super(message, {
      cause
    });

    this.details = details ?? {};
  }

  public getExtendedMessage() {

    if (Object.keys(this.details ?? {}).length === 0)
      return this.message;

    const details = Object.keys(this.details).reduce((msg, key) => {

      if (msg.length > 0)
        msg += '\n';

      msg += key + ': ' + this.details[key].join(', ');

      return msg;
    }, '');

    return this.message + '\n\n' + details;
  }

  public static parse(error: any) {

    if (error instanceof AppError)
      return error;

    if (error instanceof ZodError)
      return AppError.fromZodError(error);

    const message = error?.message ?? 'Unknow error';

    return new AppError(message, {
      cause: error
    });
  }

  public static fromZodError(error: ZodError) {

    if (!(error instanceof ZodError))
      throw new AppError('Is not zod error', {}, error);

    const validation = error.errors.reduce((obj, error) => {

      obj[error.path.join('.')] = [ error.message ];

      return obj;

    }, {} as Record<string, string[]>);

    return new AppError(AppError.invalidFieldsMessage, validation);
  }

  public static is(error: any): error is AppError {

    return error instanceof AppError;
  }

  public static invalidFieldsMessage = 'Verifique os campos inválidos';
}