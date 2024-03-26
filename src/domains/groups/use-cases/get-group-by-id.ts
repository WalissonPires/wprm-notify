import { PrismaClient } from "@prisma/client";
import { UseCase } from "@/common/use-cases";
import { UserLogged } from "@/common/auth/user";
import { Group } from "../entities";
import { GroupMapper } from "../mapper";


export class GetGroupById implements UseCase<GetGroupByIdInput, Group | null> {

  private _db: PrismaClient;
  private _user: UserLogged;

  constructor({ prismaClient, userLogged }: { prismaClient: PrismaClient, userLogged: UserLogged }) {

    this._db = prismaClient;
    this._user = userLogged;
  }

  public async execute(input: GetGroupByIdInput): Promise<Group | null> {

    const group = await this._db.group.findFirst({
      where: {
        id: input.groupId,
        accountId: this._user.accountId
      }
    });

    if (!group)
      return null;

    const mapper = new GroupMapper();
    return mapper.mapFromDb(group);
  }

}

export interface GetGroupByIdInput {
  groupId: string;
}