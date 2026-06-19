import { NextRequest, NextResponse } from "next/server";
import { UserSessionManager } from "@/domains/auth/services/user-session-maganer";
import { ApiErrorHandler } from "@/common/error/api-error-handler";
import { GetJob } from "@/domains/jobs/use-cases/get-job";

interface RequestParams {
  jobId: string;
}

export async function GET(request: NextRequest, { params }: { params: RequestParams }) {
  try {
    const useCase = new GetJob({
      userLogged: await new UserSessionManager().getUserOrThrow()
    });
    
    const result = await useCase.execute({
      jobId: params.jobId
    });

    return NextResponse.json(result);
  } catch (error) {
    return ApiErrorHandler.handler(error);
  }
}
