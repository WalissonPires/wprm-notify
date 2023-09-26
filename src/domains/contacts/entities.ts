

export interface Contact {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  groups: ContactGroup[];
  nextNotification: ContactNotification | null;
}

export interface ContactGroup {
  id: string;
  name: string;
  color: string;
}

export interface ContactNotification {
  id: string;
  triggerAt: string;
  description: string;
}