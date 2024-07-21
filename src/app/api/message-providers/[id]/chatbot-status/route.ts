import { NextRequest, NextResponse } from "next/server";
import { ApiErrorHandler } from "@/common/error/api-error-handler";
import { UserSessionManager } from "@/domains/auth/services/user-session-maganer";
import { PrismaClientFactory } from "@/common/database/prisma-factory";
import { GetProviderChatbotStatus } from "@/domains/message-providers/use-cases/get-provider-chatbot-status";
import { UpdateProviderChatbotStatus, updateProviderChatbotStatusInputSchema } from "@/domains/message-providers/use-cases/update-provider-chatbot-status";


export async function GET(request: NextRequest, { params }: { params: RequestParams }) {

  try {
    const useCase = new GetProviderChatbotStatus({
      userLogged: await new UserSessionManager().getUserOrThrow(),
      prismaClient: PrismaClientFactory.create()
    });

    const result = await useCase.execute({
      providerId: parseInt(params.id)
    });

    return NextResponse.json(result);
  }
  catch(error) {
    return ApiErrorHandler.handler(error);
  }
}


export async function PUT(request: NextRequest, { params }: { params: RequestParams }) {

  try {
    const input = updateProviderChatbotStatusInputSchema.parse(await request.json());

    const useCase = new UpdateProviderChatbotStatus({
      userLogged: await new UserSessionManager().getUserOrThrow(),
      prismaClient: PrismaClientFactory.create()
    });

    await useCase.execute({
      providerId: parseInt(params.id),
      active: input.active
    });

    return new NextResponse(null, { status: 204 });
  }
  catch(error) {
    return ApiErrorHandler.handler(error);
  }
}

interface RequestParams {
  id: string;
}