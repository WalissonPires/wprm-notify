import { NextFetchEvent, NextRequest } from "next/server";
import { errorHandleMiddleware } from "./app/middlewares/error-handler.middleware";
import { stackMiddlewares } from "./app/middlewares/stack-handler";

const middlewares = [
  errorHandleMiddleware
];

const handler = stackMiddlewares(middlewares);

export function middleware(request: NextRequest, event: NextFetchEvent) {

  handler(request, event);
}

// Limit the middleware to paths starting with `/api/`
export const config = {
  matcher: '/api/:function*',
}
