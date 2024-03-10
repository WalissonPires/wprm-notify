import { NextRequest, NextResponse } from "next/server";
import { sendMessageInputSchema } from "@/domains/messages/use-cases/send-message-types";
import { SendMessage } from "@/domains/messages/use-cases/send-message";
import { UserSessionManager } from "@/domains/auth/services/user-session-maganer";
import { PrismaClientFactory } from "@/common/database/prisma-factory";
import { ApiErrorHandler } from "@/common/error/api-error-handler";


export async function POST(request: NextRequest) {

  try {
    const input = sendMessageInputSchema.parse(await request.json());

    const useCase = new SendMessage({
      userLogged: await new UserSessionManager().getUserOrThrow(),
      prismaClient: PrismaClientFactory.create()
    });

    const result = await useCase.execute(input);

    return NextResponse.json(result);
  }
  catch(error) {
    return ApiErrorHandler.handler(error);
  }
}