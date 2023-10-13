import { NextRequest } from "next/server";
import { SendPendingNotifications } from "@/domains/notifications/use-cases/send-pending-nofitications";
import { ApiErrorHandler } from "@/common/error/api-error-handler";

export async function POST(request: NextRequest) {

  try {
    const useCase = new SendPendingNotifications();
    await useCase.execute();

    return new Response(null, {
      status: 204
    });
  }
  catch(error) {
    return ApiErrorHandler.handler(error);
  }
}