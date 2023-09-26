import { Contact as ContactDb, Group as GroupDb, ContactGroup as ContactGroupDb } from "@prisma/client";
import { Contact } from "./entities";


export class ContactMapper {

  public mapFromDb(contact: ContactEty): Contact {

    return {
      id: contact.id,
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      groups: contact.groups?.map(contactGroup => ({
        id: contactGroup.group.id,
        name: contactGroup.group.name,
        color: contactGroup.group.color
      })) ?? [],
      nextNotification: null
    };
  }
}

export interface ContactEty extends ContactDb {
  groups?: (ContactGroupDb & {
    group: GroupDb;
  })[];
}