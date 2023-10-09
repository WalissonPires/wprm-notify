import { NextRequest } from "next/server";
import { SendPendingNotifications } from "@/domains/notifications/use-cases/send-pending-nofitications";

export async function POST(request: NextRequest) {

  const useCase = new SendPendingNotifications();
  await useCase.execute();
}