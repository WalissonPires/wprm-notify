import { NextRequest, NextResponse } from "next/server";
import { PagedInputExtract } from "@/common/http/pagination/paged-input-parser";
import { ApiErrorHandler } from "@/common/error/api-error-handler";
import { PrismaClientFactory } from "@/common/database/prisma-factory";
import { UserLogged } from "@/common/auth/user";
import { GetGroups } from "@/domains/groups/use-cases/get-groups";


export async function GET(request: NextRequest) {

  try {
    const { offset, limit } = new PagedInputExtract().getFromSearchParams(request.nextUrl.searchParams);

    const useCase = new GetGroups({
      prismaClient: PrismaClientFactory.create(),
      userLogged: UserLogged.fromRequest(request)
    });

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