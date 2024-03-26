import { PrismaClient } from "@prisma/client";
import { PagedInput, PagedResult } from "@/common/http/pagination";
import { UseCase } from "@/common/use-cases";
import { UserLogged } from "@/common/auth/user";
import { Group } from "../entities";
import { GroupMapper } from "../mapper";


export class GetGroups implements UseCase<GetGroupsInput, PagedResult<Group>> {

  private _db: PrismaClient;
  private _user: UserLogged;

  constructor({ prismaClient, userLogged }: { prismaClient: PrismaClient, userLogged: UserLogged }) {

    this._db = prismaClient;
    this._user = userLogged;
  }

  public async execute(input: GetGroupsInput): Promise<PagedResult<Group>> {

    const count = await this._db.group.count({
      where: {
        accountId: this._user.accountId
      }
    });

    const groupsDb = await this._db.group.findMany({
      where: {
        accountId: this._user.accountId
      },
      skip: input.offset,
      take: input.limit,
      orderBy: {
        name: 'asc'
      }
    });

    const groupMapper = new GroupMapper();
    const data = groupsDb.map(group => groupMapper.mapFromDb(group));

    const result: PagedResult<Group> = {
      offset: input.offset,
      limit: input.limit,
      count,
      data
    };

    return result;
  }

}

export interface GetGroupsInput extends PagedInput {

}