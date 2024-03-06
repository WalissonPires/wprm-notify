import { NextRequest, NextResponse } from "next/server";
import { DeleteMessageTemplate } from "@/domains/message-templates/use-cases/delete-message-template";
import { UserSessionManager } from "@/domains/auth/services/user-session-maganer";
import { PrismaClientFactory } from "@/common/database/prisma-factory";
import { UpdateMessageTemplate } from "@/domains/message-templates/use-cases/update-message-template";
import { updateMessageTemplateInputSchema } from "@/domains/message-templates/use-cases/update-message-template-types";
import { GetMessageTemplateById } from "@/domains/message-templates/use-cases/get-message-template-by-id";
import { ApiErrorHandler } from "@/common/error/api-error-handler";


export async function GET(request: NextRequest, { params }: { params: RequestParams }) {

  try {
    const useCase = new GetMessageTemplateById({
      userLogged: await new UserSessionManager().getUserOrThrow(),
      prismaClient: PrismaClientFactory.create()
    });
    const result = await useCase.execute({
      messageTemplateId: params.id
    });

    return NextResponse.json(result);
  }
  catch(error) {
    return ApiErrorHandler.handler(error);
  }
}


export const PUT = async (request: NextRequest, { params }: { params: RequestParams }) => {

  try {
    const input = updateMessageTemplateInputSchema.parse(await request.json());

    const useCase = new UpdateMessageTemplate({
      userLogged: await new UserSessionManager().getUserOrThrow(),
      prismaClient: PrismaClientFactory.create()
    });

    const result = await useCase.execute({
      messageTemplate: {
        ...input.messageTemplate,
        id: params.id
      }
    });

    return NextResponse.json(result);
  }
  catch(error) {
    return ApiErrorHandler.handler(error);
  }
}


export const DELETE = async (request: NextRequest, { params }: { params: RequestParams }) => {

  try {
    const input = {
      messageTemplateId: params.id
    };

    const useCase = new DeleteMessageTemplate({
      userLogged: await new UserSessionManager().getUserOrThrow(),
      prismaClient: PrismaClientFactory.create()
    });

    await useCase.execute(input);

    return new NextResponse(null, { status: 204 });
  }
  catch(error) {
    return ApiErrorHandler.handler(error);
  }
}


interface RequestParams {
  id: string;
}