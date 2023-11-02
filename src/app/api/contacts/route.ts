import z from "zod";
import { NextRequest, NextResponse } from "next/server";
import { PagedInputExtract } from "@/common/http/pagination/paged-input-parser";
import { GetContacts } from "@/domains/contacts/use-cases/get-contacts";
import { ApiErrorHandler } from "@/common/error/api-error-handler";
import { PrismaClientFactory } from "@/common/database/prisma-factory";
import { UserLogged } from "@/common/auth/user";

export async function GET(request: NextRequest) {

  try {
    const { offset, limit } = new PagedInputExtract().getFromSearchParams(request.nextUrl.searchParams);

    const params = inputSchema.parse({
      query: request.nextUrl.searchParams.get('query') ?? undefined
    });

    const useCase = new GetContacts({
      prismaClient: PrismaClientFactory.create(),
      userLogged: UserLogged.fromRequest(request)
    });

    const result = await useCase.execute({
      offset,
      limit,
      query: params.query
    });

    return NextResponse.json(result);
  }
  catch(error) {
    return ApiErrorHandler.handler(error);
  }
}


const inputSchema = z.object({
  query: z.string().max(100).optional()
});