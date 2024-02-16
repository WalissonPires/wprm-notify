import z from "zod";
import { NextRequest, NextResponse } from "next/server";
import { ApiErrorHandler } from "@/common/error/api-error-handler";
import { PagedInputExtract } from "@/common/http/pagination/paged-input-parser";
import { GetNotifications } from "@/domains/notifications/use-cases/get-notifications";
import { PrismaClientFactory } from "@/common/database/prisma-factory";
import { UserSessionManager } from "@/domains/auth/services/user-session-maganer";

export async function GET(request: NextRequest) {

  try {
    const { offset, limit } = new PagedInputExtract().getFromSearchParams(request.nextUrl.searchParams);

    const params = inputSchema.parse({
      contactId: request.nextUrl.searchParams.get('contactId') ?? undefined,
      isSended: request.nextUrl.searchParams.get('isSended') ?? undefined
    });

    const useCase = new GetNotifications({
      userLogged: await new UserSessionManager().getUserOrThrow(),
      prismaClient: PrismaClientFactory.create()
    });

    const result = await useCase.execute({
      contactId: params.contactId,
      isSended: params.isSended,
      offset,
      limit
    });

    return NextResponse.json(result);
  }
  catch(error) {
    return ApiErrorHandler.handler(error);
  }
}

const inputSchema = z.object({
  contactId: z.string().optional(),
  isSended: z.coerce.boolean().optional()
});