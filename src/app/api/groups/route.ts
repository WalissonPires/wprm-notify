import { NextRequest, NextResponse } from "next/server";
import { PagedInputExtract } from "@/common/http/pagination/paged-input-parser";
import { ApiErrorHandler } from "@/common/error/api-error-handler";
import { PrismaClientFactory } from "@/common/database/prisma-factory";
import { GetGroups } from "@/domains/groups/use-cases/get-groups";
import { CreateGroup } from "@/domains/groups/use-cases/create-group";
import { createGroupInputSchema } from "@/domains/groups/use-cases/create-group-types";
import { UserSessionManager } from "@/domains/auth/services/user-session-maganer";


export async function GET(request: NextRequest) {

  try {
    const { offset, limit } = new PagedInputExtract().getFromSearchParams(request.nextUrl.searchParams);

    const useCase = new GetGroups({
      prismaClient: PrismaClientFactory.create(),
      userLogged: await new UserSessionManager().getUserOrThrow()
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


export const POST = async (request: NextRequest) => {

  try {
    const input = createGroupInputSchema.parse(await request.json());

    const useCase = new CreateGroup({
      userLogged: await new UserSessionManager().getUserOrThrow(),
      prismaClient: PrismaClientFactory.create()
    });

    const result = await useCase.execute(input);

    return NextResponse.json(result);
  }
  catch(error) {
    return ApiErrorHandler.handler(error);
  }
}