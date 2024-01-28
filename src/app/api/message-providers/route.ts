import { NextRequest, NextResponse } from "next/server";
import { PrismaClientFactory } from "@/common/database/prisma-factory";
import { ApiErrorHandler } from "@/common/error/api-error-handler";
import { UserSessionManager } from "@/domains/auth/services/user-session-maganer";
import { CreateWhatsappProvider } from "@/domains/message-providers/use-cases/create-whatsapp-provider";


export async function POST(request: NextRequest) {

  try {
    const useCase = new CreateWhatsappProvider({
      userLogged: await new UserSessionManager().getUserOrThrow(),
      prismaClient: PrismaClientFactory.create()
    });

    const result = await useCase.execute();

    return NextResponse.json(result);
  }
  catch(error) {
    return ApiErrorHandler.handler(error);
  }
}