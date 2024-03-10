import { HttpClientFactory } from "@/common/http/client/factory";
import { HttpClient } from "@/common/http/client";
import { SendMessageInput, SendMessageResult } from "./use-cases/send-message-types";

export class MessagesApi {

  private _client: HttpClient;

  constructor() {

    this._client = HttpClientFactory.create('messages');
  }

  public async send(args: SendMessageInput): Promise<SendMessageResult> {

    const result = await this._client.post<SendMessageResult>('', args);

    if (!result)
      throw new Error('Server did not return results');

    return result;
  }
}