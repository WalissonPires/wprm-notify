import { NextRequest, NextResponse } from "next/server";
import { GetMessageProvidersStatus } from "@/domains/message-providers/use-cases/get-providers-status";
import { ApiErrorHandler } from "@/common/error/api-error-handler";
import { UserSessionManager } from "@/domains/auth/services/user-session-maganer";
import { PrismaClientFactory } from "@/common/database/prisma-factory";


export async function GET(request: NextRequest) {

  try {
    const providerId = request.nextUrl.searchParams.get('id');

    const useCase = new GetMessageProvidersStatus({
      userLogged: await new UserSessionManager().getUserOrThrow(),
      prismaClient: PrismaClientFactory.create()
    });

    const result = await useCase.execute({
      providerId: providerId ? parseInt(providerId) : undefined
    });

    return NextResponse.json(result);
  }
  catch(error) {
    return ApiErrorHandler.handler(error);
  }
}