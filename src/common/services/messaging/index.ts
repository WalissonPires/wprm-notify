import { AppConfig } from "../../configuration";
import { HttpClient } from "../../http/client";


export class MessagingApi {

  private _client: HttpClient;

  constructor() {

    const conifig = new AppConfig();
    this._client = new HttpClient({
      baseUrl: conifig.SendMessageApiUrl(),
      defaultHeaders: {
        'Authorization': [ conifig.SendMessageApiToken() ]
      }
    });
  }
  public async sendMessage(args: SendMessageArgs) {

    await this._client.post<void>('messages', args);
  }
}

export interface SendMessageArgs {
  to: string;
  content: string;
}