

export abstract class AppRoutes {

  public static newContactNotification(contactId: string) { return `/contact-notifications/${contactId}/new`; }
  public static home() { return '/'; }
}