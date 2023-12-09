import { AppError } from "../../error";


export async function tryExecute<T>(promise: Promise<T>): Promise<ExecutionResult<T>> {

  try {
    const data = await promise;

    return {
      success: true,
      data
    };
  }
  catch(error) {
    return {
      success: false,
      error: AppError.parse(error)
    };
  }
}

export function isExecuteSuccess<T>(result: ExecutionResult<T>): result is ExecutionSuccess<T> {

  return result.success === true;
}

export function isExecuteError<T>(result: ExecutionResult<T>): result is ExecutionError {

  return result.success === false;
}


type ExecutionSuccess<T> = { success: true, data: T };
type ExecutionError = { success: false, error: AppError };
type ExecutionResult<T> = ExecutionSuccess<T> | ExecutionError;