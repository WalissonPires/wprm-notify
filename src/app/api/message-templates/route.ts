import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { PagedInputExtract } from "@/common/http/pagination/paged-input-parser";
import { GetMessageTemplates } from "@/domains/message-templates/use-cases/get-message-templates";
import { ApiErrorHandler } from "@/common/error/api-error-handler";
import { CreateMessageTemplate } from "@/domains/message-templates/use-cases/create-message-template";
import { createMessateTemplateInputSchema } from "@/domains/message-templates/use-cases/create-message-template-types";
import { UserLogged } from "@/common/auth/user";

export async function GET(request: NextRequest) {

  try {
    const { offset, limit } = new PagedInputExtract().getFromSearchParams(request.nextUrl.searchParams);

    const useCase = new GetMessageTemplates();
    const result = await useCase.execute({
      offset,
      limit
    });

    return NextResponse.json(result);
  }
  catch(error) {
    return ApiErrorHandler.handler(error);
  }
}

export const POST = async (request: NextRequest) => {

  try {
    const input = createMessateTemplateInputSchema.parse(await request.json());

    const useCase = new CreateMessageTemplate({
      userLogged: UserLogged.fromRequest(request),
      prismaClient: new PrismaClient
    });

    const result = await useCase.execute(input);

    return NextResponse.json(result);
  }
  catch(error) {
    return ApiErrorHandler.handler(error);
  }
};