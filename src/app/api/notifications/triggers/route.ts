import { NextRequest, NextResponse } from "next/server";
import { RegisterNotificationTrigger } from "@/domains/notification-triggers/use-cases/register-notification-trigger";
import { RegisterNotificationTriggerInput } from "@/domains/notification-triggers/use-cases/register-notification-trigger-types";
import { ApiErrorHandler } from "@/common/error/api-error-handler";

export async function POST(request: NextRequest) {

  try {
    const input: RegisterNotificationTriggerInput = await request.json();

    const useCase = new RegisterNotificationTrigger();
    const result = await useCase.execute(input);

    return NextResponse.json(result);
  }
  catch(error) {
    return ApiErrorHandler.handler(error);
  }
}