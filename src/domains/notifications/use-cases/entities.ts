

export interface Notification1 {
  id: string;
  sendedAt: string | null;
  canceledAt: string | null;
  scheduledAt: string;
  content: string;
  contact: {
    id: string;
    name: string;
  } | null
}