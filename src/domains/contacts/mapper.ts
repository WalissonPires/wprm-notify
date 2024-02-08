import { Contact as ContactDb, Group as GroupDb, ContactGroup as ContactGroupDb, Notification as NotificationDb } from "@prisma/client";
import { Contact } from "./entities";
import { sortAsc } from "@/common/primitives/array/sort-utils";


export class ContactMapper {

  public mapFromDb(contact: ContactEty): Contact {

    const nextNotification = contact.notifications?.sort((a, b) => sortAsc(a.scheduledAt, b.scheduledAt)).at(0);

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
      nextNotification: nextNotification ? {
        id: nextNotification.id,
        description: nextNotification.content,
        triggerAt: nextNotification.scheduledAt.toISOString()
      } : null
    };
  }
}

export interface ContactEty extends ContactDb {
  groups?: (ContactGroupDb & {
    group: GroupDb;
  })[];
  notifications?: NotificationDb[]
}