import { NextRequest, NextResponse } from "next/server";
import { GetContactById } from "@/domains/contacts/use-cases/get-contacts-by-id";
import { PrismaClientFactory } from "@/common/database/prisma-factory";
import { UserLogged } from "@/common/auth/user";
import { UpdateContact } from "@/domains/contacts/use-cases/update-contact";
import { ContactValidation } from "@/domains/contacts/use-cases/contact-validation";
import { DeleteContact } from "@/domains/contacts/use-cases/delete-contact";
import { updateContactInputSchema } from "@/domains/contacts/use-cases/update-contact-types";
import { ApiErrorHandler } from "@/common/error/api-error-handler";


export const GET = async (request: NextRequest, { params }: ContactIdParams) => {

  try {
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
  catch(error) {
    return ApiErrorHandler.handler(error);
  }
}

export const PUT = async (request: NextRequest, { params }: ContactIdParams) => {

  try {
    const input = updateContactInputSchema.parse(await request.json());

    const user = UserLogged.fromRequest(request);
    const prismaClient = PrismaClientFactory.create();

    const useCase = new UpdateContact({
      userLogged: user,
      prismaClient: prismaClient,
      contactValidation: new ContactValidation({
        userLogged: user,
        prismaClient: prismaClient
      })
    });

    const getById = new GetContactById({
      userLogged: user,
      prismaClient: prismaClient
    });

    await useCase.execute({
      contact: {
        ...input.contact,
        id: params.id
      }
    });

    const result = await getById.execute({ contactId: params.id });

    return NextResponse.json(result);
  }
  catch(error) {
    return ApiErrorHandler.handler(error);
  }
};

export const DELETE = async (request: NextRequest, { params }: ContactIdParams) => {

  try {
    const useCase = new DeleteContact({
      prismaClient: PrismaClientFactory.create(),
      userLogged: UserLogged.fromRequest(request)
    });

    await useCase.execute({
      contactId: params.id
    });

    return new NextResponse(null, { status: 204 });
  }
   catch(error) {
    return ApiErrorHandler.handler(error);
  }
}

interface ContactIdParams {
  params: {
    id: string;
  }
}