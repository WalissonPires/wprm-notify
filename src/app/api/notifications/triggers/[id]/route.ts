import { NextRequest, NextResponse } from "next/server";
import { DeleteNotificationTrigger } from "@/domains/notification-triggers/use-cases/delete-notification-trigger";
import { PrismaClientFactory } from "@/common/database/prisma-factory";
import { UserSessionManager } from "@/domains/auth/services/user-session-maganer";


export async function DELETE(request: NextRequest, { params }: { params: DeleteParams }) {

  const useCase = new DeleteNotificationTrigger({
    userLogged: await new UserSessionManager().getUserOrThrow(),
    prismaClient: PrismaClientFactory.create()
  });

  await useCase.execute({
    id: params.id
  });

  return new Response(null, { status: 204 });
}

interface DeleteParams {
  id: string;
}