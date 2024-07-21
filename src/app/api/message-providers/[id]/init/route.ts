import { NextRequest, NextResponse } from "next/server";
import { PrismaClientFactory } from "@/common/database/prisma-factory";
import { ApiErrorHandler } from "@/common/error/api-error-handler";
import { UserSessionManager } from "@/domains/auth/services/user-session-maganer";
import { InitProvider } from "@/domains/message-providers/use-cases/init-provider";

export async function POST(request: NextRequest, { params }: { params: RequestParams }) {

  try {
    const useCase = new InitProvider({
      userLogged: await new UserSessionManager().getUserOrThrow(),
      prismaClient: PrismaClientFactory.create()
    });

    await useCase.execute({
      providerId: parseInt(params.id)
    });

    return  new NextResponse(null, { status: 204 });
  }
  catch(error) {
    return ApiErrorHandler.handler(error);
  }
}

interface RequestParams {
  id: string;
}