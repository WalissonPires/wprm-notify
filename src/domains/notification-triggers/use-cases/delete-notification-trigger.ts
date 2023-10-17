import { UseCase } from "@/common/use-cases";
import { PrismaClient } from "@prisma/client";


export class DeleteNotificationTrigger implements UseCase<DeleteNotificationTriggerInput, void> {

  public async execute(input: DeleteNotificationTriggerInput): Promise<void> {

    const db = new PrismaClient();

    await db.notificationTrigger.deleteMany({
      where: { id: input.id }
    });
  }

}

export interface DeleteNotificationTriggerInput {
  id: string;
}