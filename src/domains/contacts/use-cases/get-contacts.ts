import { PrismaClient } from "@prisma/client";
import { PagedInput, PagedResult } from "@/common/http/pagination";
import { UseCase } from "@/common/use-cases";
import { Contact } from "../entities";
import { ContactMapper } from "../mapper";

export class GetContacts implements UseCase<GetContactInput, PagedResult<Contact>> {

  public async execute(input: GetContactInput): Promise<PagedResult<Contact>> {

    const db = new PrismaClient();

    const count = await db.contact.count();

    const contacts = await db.contact.findMany({
      skip: input.offset,
      take: input.limit,
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

export interface GetContactInput extends PagedInput {

}