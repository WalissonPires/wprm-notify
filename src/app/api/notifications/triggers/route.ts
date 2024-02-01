import { NextRequest, NextResponse } from "next/server";
import { ApiErrorHandler } from "@/common/error/api-error-handler";
import { PagedInputExtract } from "@/common/http/pagination/paged-input-parser";
import { RegisterNotificationTrigger } from "@/domains/notification-triggers/use-cases/register-notification-trigger";
import { RegisterNotificationTriggerInput } from "@/domains/notification-triggers/use-cases/register-notification-trigger-types";
import { GetNotificationTriggers } from "@/domains/notification-triggers/use-cases/get-notification-triggers";
import { GenerateNotificationsByTriggers } from "@/domains/notifications/use-cases/generate-notification-by-triggers";

export async function POST(request: NextRequest) {

  try {
    const input: RegisterNotificationTriggerInput = await request.json();

    const useCase = new RegisterNotificationTrigger();
    const trigger = await useCase.execute(input);

    const generateNotificaion = new GenerateNotificationsByTriggers();
    await generateNotificaion.execute({
      triggerId: trigger.id
    });

    return NextResponse.json(trigger);
  }
  catch(error) {
    return ApiErrorHandler.handler(error);
  }
}

export async function GET(request: NextRequest) {

  try {
    const { offset, limit } = new PagedInputExtract().getFromSearchParams(request.nextUrl.searchParams);
    const contactId = request.nextUrl.searchParams.get('contactId');

    const useCase = new GetNotificationTriggers();
    const result = await useCase.execute({
      contactId: contactId ?? undefined,
      offset,
      limit
    });

    return NextResponse.json(result);
  }
  catch(error) {
    return ApiErrorHandler.handler(error);
  }
}