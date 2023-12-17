import z from "zod";
import { NextRequest, NextResponse } from "next/server";
import { PagedInputExtract } from "@/common/http/pagination/paged-input-parser";
import { URLSearchParamsParser } from "@/common/http/url/url-params-parser";
import { GetContacts } from "@/domains/contacts/use-cases/get-contacts";
import { ApiErrorHandler } from "@/common/error/api-error-handler";
import { PrismaClientFactory } from "@/common/database/prisma-factory";
import { UserLogged } from "@/common/auth/user";
import { createContactInputSchema } from "@/domains/contacts/use-cases/create-contact-types";
import { CreateContact } from "@/domains/contacts/use-cases/create-contact";
import { GetContactById } from "@/domains/contacts/use-cases/get-contacts-by-id";
import { ContactValidation } from "@/domains/contacts/use-cases/contact-validation";


export async function GET(request: NextRequest) {

  try {
    const { offset, limit } = new PagedInputExtract().getFromSearchParams(request.nextUrl.searchParams);

    const qs = URLSearchParamsParser.toObject(request.nextUrl.searchParams);
    const params = inputSchema.parse({
      query: qs.query?.at(0) ?? undefined,
      groupsId: qs.groupsId ?? undefined,
    });

    const useCase = new GetContacts({
      prismaClient: PrismaClientFactory.create(),
      userLogged: UserLogged.fromRequest(request)
    });

    const result = await useCase.execute({
      offset,
      limit,
      query: params.query,
      groupsId: params.groupsId
    });

    return NextResponse.json(result);
  }
  catch(error) {
    return ApiErrorHandler.handler(error);
  }
}


export const POST = async (request: NextRequest) => {

  try {
    const input = createContactInputSchema.parse(await request.json());

    const user = UserLogged.fromRequest(request);
    const prismaClient = PrismaClientFactory.create();

    const useCase = new CreateContact({
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

    const { id: contactId } = await useCase.execute(input);
    const result = await getById.execute({ contactId });

    return NextResponse.json(result);
  }
  catch(error) {
    return ApiErrorHandler.handler(error);
  }
};


const inputSchema = z.object({
  query: z.string().max(100).optional(),
  groupsId: z.array(z.string().max(26)).optional()
});