import { Prisma, PrismaClient } from "@prisma/client";
import { PagedInput, PagedResult } from "@/common/http/pagination";
import { UseCase } from "@/common/use-cases";
import { UserLogged } from "@/common/auth/user";
import { Contact } from "../entities";
import { ContactMapper } from "../mapper";

export class GetContacts implements UseCase<GetContactsInput, PagedResult<Contact>> {

  private _db: PrismaClient;
  private _user: UserLogged;

  constructor({ prismaClient, userLogged }: { prismaClient: PrismaClient, userLogged: UserLogged }) {

    this._db = prismaClient;
    this._user = userLogged;
  }

  public async execute(input: GetContactsInput): Promise<PagedResult<Contact>> {

    const filter: Prisma.ContactWhereInput = {};

    if (input.query?.length! > 0) {

      filter.OR = [{
        name: {
          contains: input.query,
          mode: 'insensitive'
        }
      }, {
        phone: {
        contains: input.query
      }}, {
        email: {
          contains: input.query,
          mode: 'insensitive'
        }
      }];
    }

    const count = await this._db.contact.count({
      where: filter
    });

    const contacts = await this._db.contact.findMany({
      skip: input.offset,
      take: input.limit,
      where: filter,
      include: {
        groups: {
          include: {
            group: true
          }
        },
        notifications: {
          where: {
            sendedAt: null
          },
          orderBy: {
            scheduledAt: 'asc',
          },
          take: 1
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    const mapper = new ContactMapper();
    const data: Contact[] = contacts.map(c => mapper.mapFromDb(c));

    const result: PagedResult<Contact> = {
      offset: input.offset,
      limit: input.limit,
      count,
      data
    };

    return result;
  }

}

export interface GetContactsInput extends PagedInput {
  query?: string;
}