import { PrismaClient } from "@prisma/client";
import { UseCase } from "@/common/use-cases";
import { UserLogged } from "@/common/auth/user";
import { AppError } from "@/common/error";
import { UpdateGroupInput } from "./update-group-types";
import { Group } from "../entities";

export class UpdateGroup implements UseCase<UpdateGroupInput, Group> {

  private _user: UserLogged;
  private _db: PrismaClient;

  constructor({ userLogged, prismaClient }: { userLogged: UserLogged, prismaClient: PrismaClient }) {

    this._user = userLogged;
    this._db = prismaClient;
  }

  public async execute(input: UpdateGroupInput): Promise<Group> {

    const group: Group = {
      id: input.group.id,
      name: input.group.name,
      color: input.group.color,
    };

    const groupExists = await this._db.group.findFirst({
      where: {
        id: {
          not: {
            equals: group.id,
          }
        },
        accountId: this._user.accountId,
        name: {
          equals: group.name,
          mode: 'insensitive'
        }
      },
      select: {
        id: true
      }
    });

    if (groupExists)
      throw new AppError('Existe um grupo com esse nome');

    await this._db.group.update({
      where: {
        id: group.id,
        accountId: this._user.accountId
      },
      data: {
        name: group.name,
        color: group.color,
        updatedAt: new Date()
      }
    });

    return group;
  }
}