import { NextRequest, NextResponse } from "next/server";
import { PrismaClientFactory } from "@/common/database/prisma-factory";
import { ApiErrorHandler } from "@/common/error/api-error-handler";
import { UserSessionManager } from "@/domains/auth/services/user-session-maganer";
import { GetMessageTemplateParam } from "@/domains/message-templates/use-cases/get-message-template-param";
import { MessageTemplateParamType } from "@/domains/message-templates/entities";
import { parseDataUrl } from "@/common/primitives/file/data-url";


export async function GET(request: NextRequest, { params }: { params: RequestParams }) {

  try {
    const useCase = new GetMessageTemplateParam({
      userLogged: await new UserSessionManager().getUserOrThrow(),
      prismaClient: PrismaClientFactory.create()
    });

    const param = await useCase.execute({
      messageTemplateId: params.id,
      paramName: params.paramName
    });

    if (!param)
      return new NextResponse(null, { status: 404 });

    if (param.type != MessageTemplateParamType.File || !param.value)
      return new NextResponse(param.value);

    const dataUrlMeta = parseDataUrl(param.value);
    if (!dataUrlMeta)
      return new NextResponse(null);

    const buffer = Buffer.from(dataUrlMeta.base64, 'base64');

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': dataUrlMeta?.mimeType ?? 'application/octet-stream',
        'Content-Disposition': `inline; filename="${param.name}"`
      }
    });
  }
  catch(error) {
    return ApiErrorHandler.handler(error);
  }
}

interface RequestParams {
  id: string;
  paramName: string;
}