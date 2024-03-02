import { NextRequest, NextResponse } from "next/server";
import { UserSessionManager } from "@/domains/auth/services/user-session-maganer";
import { PrismaClientFactory } from "@/common/database/prisma-factory";
import { ImportContacts } from "@/domains/contacts/use-cases/import-contacts";
import { ContactValidation } from "@/domains/contacts/use-cases/contact-validation";
import { ApiErrorHandler } from "@/common/error/api-error-handler";
import { importContactInputSchema } from "@/domains/contacts/use-cases/import-contacts-types";


export const POST = async (request: NextRequest) => {

  try {
    const input = importContactInputSchema.parse(await request.json());

    const user = await new UserSessionManager().getUserOrThrow();
    const prismaClient = PrismaClientFactory.create();

    const useCase = new ImportContacts({
      userLogged: user,
      prismaClient: prismaClient,
      contactValidation: new ContactValidation({
        userLogged: user,
        prismaClient: prismaClient
      })
    });

    const result = await useCase.execute(input);

    return NextResponse.json(result);
  }
  catch(error) {
    return ApiErrorHandler.handler(error);
  }
};
