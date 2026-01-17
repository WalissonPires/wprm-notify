

export interface Notification1 {
  id: string;
  sendedAt: string | null;
  canceledAt: string | null;
  scheduledAt: string;
  errorAt: string | null;
  errorMessage: string | null;
  content: string;
  contact: {
    id: string;
    name: string;
  } | null
}