import { NextRequest, NextResponse } from "next/server";
import { DeleteNotificationTrigger } from "@/domains/notification-triggers/use-cases/delete-notification-trigger";
import { PrismaClientFactory } from "@/common/database/prisma-factory";
import { UserSessionManager } from "@/domains/auth/services/user-session-maganer";
import { GetNotificationTrigger } from "@/domains/notification-triggers/use-cases/get-notification-trigger";
import { ApiErrorHandler } from "@/common/error/api-error-handler";
import { UpdateNotificationTriggerInput } from "@/domains/notification-triggers/use-cases/update-notification-trigger-types";
import { UpdateNotificationTrigger } from "@/domains/notification-triggers/use-cases/update-notification-trigger";
import { GenerateNotificationsByTriggers } from "@/domains/notifications/use-cases/generate-notification-by-triggers";

export async function GET(request: NextRequest, { params }: { params: RequestParams }) {

  try {
    if (!params.id)
      return NextResponse.json(null);

    const useCase = new GetNotificationTrigger({
      userLogged: await new UserSessionManager().getUserOrThrow(),
      prismaClient: PrismaClientFactory.create()
    });

    const result = await useCase.execute({
      triggerId: params.id
    });

    return NextResponse.json(result);
  }
  catch(error) {
    return ApiErrorHandler.handler(error);
  }
}

export async function PUT(request: NextRequest) {

  try {
    const input: UpdateNotificationTriggerInput = await request.json();

    const useCase = new UpdateNotificationTrigger({
      userLogged: await new UserSessionManager().getUserOrThrow(),
      prismaClient: PrismaClientFactory.create()
    });

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

export async function DELETE(request: NextRequest, { params }: { params: RequestParams }) {

  try {
    const useCase = new DeleteNotificationTrigger({
      userLogged: await new UserSessionManager().getUserOrThrow(),
      prismaClient: PrismaClientFactory.create()
    });

    await useCase.execute({
      id: params.id
    });

    return new Response(null, { status: 204 });
  }
  catch(error) {
    return ApiErrorHandler.handler(error);
  }
}

interface RequestParams {
  id: string;
}