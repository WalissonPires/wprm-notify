import { NextRequest, NextResponse } from "next/server";
import { ApiErrorHandler } from "@/common/error/api-error-handler";
import { UserSessionManager } from "@/domains/auth/services/user-session-maganer";
import { PrismaClientFactory } from "@/common/database/prisma-factory";
import { GetProviderChatbotFlow } from "@/domains/message-providers/use-cases/get-provider-chatbot-flow";
import { UpdateProviderChatbotFlow, updateProviderChatbotFlowInputSchema } from "@/domains/message-providers/use-cases/update-provider-chatbot-flow";


export async function GET(request: NextRequest, { params }: { params: RequestParams }) {

  try {
    const useCase = new GetProviderChatbotFlow({
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
    const input = updateProviderChatbotFlowInputSchema.parse(await request.json());

    const useCase = new UpdateProviderChatbotFlow({
      userLogged: await new UserSessionManager().getUserOrThrow(),
      prismaClient: PrismaClientFactory.create()
    });

    await useCase.execute({
      providerId: parseInt(params.id),
      chatbotFlow: input.chatbotFlow
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