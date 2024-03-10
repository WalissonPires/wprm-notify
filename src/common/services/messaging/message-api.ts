import { AppConfig } from "../../configuration";
import { HttpClient } from "../../http/client";

export class MessagingApi {

  private _client: HttpClient;

  constructor(ops: { accessToken: string }) {

    const config = new AppConfig();
    this._client = new HttpClient({
      baseUrl: config.SendMessageApiUrl(),
      defaultHeaders: {
        'Authorization': [ 'Bearer ' + ops.accessToken ]
      }
    });
  }
  public async sendMessage(args: SendMessageArgs): Promise<SendMessageStatus[]> {

    return await this._client.post<SendMessageStatus[]>('messages', args) ?? [];
  }
}

export interface SendMessageArgs {
  to: string;
  content: string;
}

export interface SendMessageStatus {
  providerId: number;
  success: boolean;
  errorMessage: string | null;
}