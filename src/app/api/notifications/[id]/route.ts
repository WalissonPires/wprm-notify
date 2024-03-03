import { NextRequest, NextResponse } from "next/server";
import { CancelNotification } from "@/domains/notifications/use-cases/cancel-notification";
import { UserSessionManager } from "@/domains/auth/services/user-session-maganer";
import { PrismaClientFactory } from "@/common/database/prisma-factory";

export const DELETE = async (request: NextRequest, { params }: { params: DeleteParams }) => {

  const input = {
    notificationId: params.id
  };

  const useCase = new CancelNotification({
    userLogged: await new UserSessionManager().getUserOrThrow(),
    prismaClient: PrismaClientFactory.create()
  });

  await useCase.execute(input);

  return new NextResponse(null, { status: 204 });
}


interface DeleteParams {
  id: string;
}