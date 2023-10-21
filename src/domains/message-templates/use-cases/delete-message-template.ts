import { PrismaClient } from "@prisma/client";
import { UseCase } from "@/common/use-cases";


export class DeleteMessageTemplate implements UseCase<DeleteMessageTemplateInput, void> {

  private _db: PrismaClient;

  constructor({ prismaClient }: { prismaClient: PrismaClient }) {

    this._db = prismaClient;
  }

  public async execute(input: DeleteMessageTemplateInput): Promise<void> {

    await this._db.templateMessage.deleteMany({
      where: {
        id: input.messageTemplateId
      }
    });
  }
}

export interface DeleteMessageTemplateInput {
  messageTemplateId: string;
}