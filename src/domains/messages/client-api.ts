import { HttpClientFactory } from "@/common/http/client/factory";
import { HttpClient } from "@/common/http/client";
import { SendMessageInput } from "./use-cases/send-message-types";
import { SendMessageAsyncResult } from "./use-cases/send-message-async-types";

export class MessagesApi {

  private _client: HttpClient;

  constructor() {

    this._client = HttpClientFactory.create('messages');
  }

  public async send(args: SendMessageInput): Promise<SendMessageAsyncResult> {

    const result = await this._client.post<SendMessageAsyncResult>('', args);

    if (!result)
      throw new Error('Server did not return results');

    return result;
  }
}