import { NextRequest } from "next/server";
import { GenerateNotificationsByTriggers } from "@/domains/notifications/use-cases/generate-notification-by-triggers";

export async function POST(request: NextRequest) {

  const useCase = new GenerateNotificationsByTriggers();
  await useCase.execute();

  return new Response(null, {
    status: 204
  });
}