import { SendMessageInput } from "./send-message-types";

export interface SendMessageAsyncResult {
  jobId: string;
}

export interface SendMessageJobMetadata {
  groupsId?: string[];
  contactsId?: string[];
  message: {
    content: string;
    medias?: {
      mimeType: string;
      label?: string;
    }[];
  };
}
