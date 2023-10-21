import { NextRequest, NextResponse } from "next/server";
import { DeleteMessageTemplate } from "@/domains/message-templates/use-cases/delete-message-template";
import { PrismaClientFactory } from "@/common/database/prisma-factory";


export const DELETE = async (request: NextRequest, { params }: { params: DeleteParams }) => {

  const input = {
    messageTemplateId: params.id
  };

  const useCase = new DeleteMessageTemplate({
    prismaClient: PrismaClientFactory.create()
  });

  await useCase.execute(input);

  return new NextResponse(null, { status: 204 });
}


interface DeleteParams {
  id: string;
}