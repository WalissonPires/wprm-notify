import { NextRequest, NextResponse } from "next/server";
import { PagedInputExtract } from "@/common/http/pagination/paged-input-parser";
import { GetContacts } from "@/domains/contacts/use-cases/get-contacts";

export async function GET(request: NextRequest) {

    const { offset, limit } = new PagedInputExtract().getFromSearchParams(request.nextUrl.searchParams);

    const useCase = new GetContacts();
    const result = await useCase.execute({
        offset,
        limit
    });

    return NextResponse.json(result);
}