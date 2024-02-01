import { UseCase } from "@/common/use-cases";
import { PrismaClientFactory } from "@/common/database/prisma-factory";


export class DeleteNotificationTrigger implements UseCase<DeleteNotificationTriggerInput, void> {

  public async execute(input: DeleteNotificationTriggerInput): Promise<void> {

    const db = PrismaClientFactory.create();

    await db.notificationTrigger.deleteMany({
      where: { id: input.id }
    });
  }

}

export interface DeleteNotificationTriggerInput {
  id: string;
}