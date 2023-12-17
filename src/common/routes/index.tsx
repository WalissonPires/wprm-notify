

export abstract class AppRoutes {

  public static newContact() { return '/contacts/new'; }
  public static viewContact(contactId: string) { return '/contacts/' + contactId; }
  public static newContactNotification(contactId: string) { return `/contacts/${contactId}/notification-triggers/new`; }
  public static contactNotificationTriggers(contactId: string) { return `/contacts/${contactId}/notification-triggers`; }
  public static contactNotifications(contactId: string) { return `/contacts/${contactId}/notifications`; }
  public static home() { return '/'; }
  public static notifications() { return '/notifications'; }
  public static messageTemplates() { return '/message-templates'; }
  public static newMessageTemplates() { return '/message-templates/new'; }
  public static settings() { return '/settings'; }
}