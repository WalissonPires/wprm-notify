import { PrismaClient } from "@prisma/client";
import { UseCase } from "@/common/use-cases";
import { IdGenerator } from "@/common/identity/generate";
import { UserLogged } from "@/common/auth/user";
import { AppError } from "@/common/error";
import { CreateGroupInput } from "./create-group-types";
import { Group } from "../entities";

export class CreateGroup implements UseCase<CreateGroupInput, Group> {

  private _user: UserLogged;
  private _db: PrismaClient;

  constructor({ userLogged, prismaClient }: { userLogged: UserLogged, prismaClient: PrismaClient }) {

    this._user = userLogged;
    this._db = prismaClient;
  }

  public async execute(input: CreateGroupInput): Promise<Group> {

    const idGen = new IdGenerator();

    const group: Group = {
      id: idGen.new(),
      name: input.group.name,
      color: input.group.color,
    };

    const groupExists = await this._db.group.findFirst({
      where: {
        accountId: this._user.accountId,
        name: {
          equals: input.group.name,
          mode: 'insensitive'
        }
      },
      select: {
        id: true
      }
    });

    if (groupExists)
      throw new AppError('Existe um grupo com esse nome');

    await this._db.group.create({
      data: {
        id: group.id,
        accountId: this._user.accountId,
        name: group.name,
        color: group.color,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    return group;
  }
}