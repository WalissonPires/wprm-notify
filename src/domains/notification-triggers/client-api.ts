import { HttpClientFactory } from "@/common/http/client/factory";
import { HttpClient } from "@/common/http/client";
import { RegisterNotificationTriggerInput } from "./use-cases/register-notification-trigger-types";
import { Trigger } from "./entities";

export class NotificationTriggersApi {

  private _client: HttpClient;

  constructor() {

    this._client = HttpClientFactory.create('notifications/triggers');
  }

  public async register(args: RegisterNotificationTriggerInput): Promise<Trigger> {

    const result = await this._client.post<Trigger>('', args);

    if (!result)
      throw new Error('Server did not return results');

    return result;
  }
}