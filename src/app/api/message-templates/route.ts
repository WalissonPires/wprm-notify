import { NextRequest, NextResponse } from "next/server";
import { PagedInputExtract } from "@/common/http/pagination/paged-input-parser";
import { GetMessageTemplates } from "@/domains/message-templates/use-cases/get-message-templates";
import { ApiErrorHandler } from "@/common/error/api-error-handler";

export async function GET(request: NextRequest) {

  try {
    const { offset, limit } = new PagedInputExtract().getFromSearchParams(request.nextUrl.searchParams);

    const useCase = new GetMessageTemplates();
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