import { ApiErrorHandler } from "@/common/error/api-error-handler";
import { MiddlewareFactory } from "./base";

// Não funciona porque o next já trata as exceções
export const errorHandleMiddleware: MiddlewareFactory = (next) => {

  return (request, event) => {

    try {
      return next(request, event);
    }
    catch(error) {

      return ApiErrorHandler.handler(error);
    }
  };
}