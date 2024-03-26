import { NextRequest, NextResponse } from "next/server";
import { UserSessionManager } from "@/domains/auth/services/user-session-maganer";
import { PrismaClientFactory } from "@/common/database/prisma-factory";
import { ApiErrorHandler } from "@/common/error/api-error-handler";
import { DeleteGroup } from "@/domains/groups/use-cases/delete-group";
import { GetGroupById } from "@/domains/groups/use-cases/get-group-by-id";
import { UpdateGroup } from "@/domains/groups/use-cases/update-group";
import { updateGroupInputSchema } from "@/domains/groups/use-cases/update-group-types";


export async function GET(request: NextRequest, { params }: { params: RequestParams }) {

  try {
    const useCase = new GetGroupById({
      userLogged: await new UserSessionManager().getUserOrThrow(),
      prismaClient: PrismaClientFactory.create()
    });

    const result = await useCase.execute({
      groupId: params.id
    });

    return NextResponse.json(result);
  }
  catch(error) {
    return ApiErrorHandler.handler(error);
  }
}


export const PUT = async (request: NextRequest, { params }: { params: RequestParams }) => {

  try {
    const input = updateGroupInputSchema.parse(await request.json());

    const useCase = new UpdateGroup({
      userLogged: await new UserSessionManager().getUserOrThrow(),
      prismaClient: PrismaClientFactory.create()
    });

    const result = await useCase.execute({
      group: {
        ...input.group,
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
      groupId: params.id
    };

    const useCase = new DeleteGroup({
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