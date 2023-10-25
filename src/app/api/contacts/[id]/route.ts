import { NextRequest, NextResponse } from "next/server";
import { GetContactById } from "@/domains/contacts/use-cases/get-contacts-by-id";
import { PrismaClientFactory } from "@/common/database/prisma-factory";
import { UserLogged } from "@/common/auth/user";


export const GET = async (request: NextRequest, { params }: GetParams) => {

  const useCase = new GetContactById({
    prismaClient: PrismaClientFactory.create(),
    userLogged: UserLogged.fromRequest(request)
  });

  const result = await useCase.execute({
    contactId: params.id
  });

  if (!result)
    return new NextResponse(null, { status: 404 });

  return NextResponse.json(result);
}

interface GetParams {
  params: {
    id: string;
  }
}