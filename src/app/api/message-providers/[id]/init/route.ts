import { NextRequest, NextResponse } from "next/server";
import { PrismaClientFactory } from "@/common/database/prisma-factory";
import { ApiErrorHandler } from "@/common/error/api-error-handler";
import { UserSessionManager } from "@/domains/auth/services/user-session-maganer";
import { InitProvider } from "@/domains/message-providers/use-cases/init-provider";

export async function POST(request: NextRequest, { params }: { params: PostParams }) {

  try {
    const useCase = new InitProvider({
      userLogged: await new UserSessionManager().getUserOrThrow(),
      prismaClient: PrismaClientFactory.create()
    });

    await useCase.execute({
      providerId: parseInt(params.id)
    });

    return NextResponse.json(null, { status: 204 });
  }
  catch(error) {
    return ApiErrorHandler.handler(error);
  }
}


interface PostParams {
  id: string;
}