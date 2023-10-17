import { NextRequest, NextResponse } from "next/server";
import { DeleteNotificationTrigger } from "@/domains/notification-triggers/use-cases/delete-notification-trigger";


export async function DELETE(request: NextRequest, { params }: { params: DeleteParams }) {

  const useCase = new DeleteNotificationTrigger();

  await useCase.execute({
    id: params.id
  });

  return new Response(null, { status: 204 });
}

interface DeleteParams {
  id: string;
}