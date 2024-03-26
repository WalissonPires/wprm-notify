

export abstract class AppRoutes {

  public static newContact() { return '/contacts/new'; }
  public static importContacts() { return '/contacts/import'; }
  public static viewContact(contactId: string) { return '/contacts/' + contactId; }
  public static newContactNotification(contactId: string) { return `/contacts/${contactId}/notification-triggers/new`; }
  public static contactNotificationTriggers(contactId: string) { return `/contacts/${contactId}/notification-triggers`; }
  public static contactNotifications(contactId: string) { return `/contacts/${contactId}/notifications`; }
  public static home() { return '/'; }
  public static notifications() { return '/notifications'; }
  public static viewMessageTemplate(messageTemplateId: string) { return '/message-templates/' + messageTemplateId; }
  public static messageTemplates() { return '/message-templates'; }
  public static newMessageTemplates() { return '/message-templates/new'; }
  public static settings() { return '/settings'; }
  public static login() { return '/login'; }
  public static message() { return '/message'; }
  public static viewGroup(groupId: string) { return '/groups/' + groupId; }
  public static groups() { return '/groups'; }
  public static newGroup() { return '/groups/new'; }
}