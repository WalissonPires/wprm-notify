import { NextRequest } from "next/server";
import { GenerateNotificationsByTriggers } from "@/domains/notifications/use-cases/generate-notification-by-triggers";
import { ApiErrorHandler } from "@/common/error/api-error-handler";

export async function POST(request: NextRequest) {

  try {
    const useCase = new GenerateNotificationsByTriggers();
    await useCase.execute({});

    return new Response(null, {
      status: 204
    });
  }
  catch(error) {
    return ApiErrorHandler.handler(error);
  }
}