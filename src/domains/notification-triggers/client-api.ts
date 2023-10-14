import { HttpClientFactory } from "@/common/http/client/factory";
import { HttpClient } from "@/common/http/client";
import { PagedInput, PagedResult } from "@/common/http/pagination";
import { UrlFormatter } from "@/common/http/url/url-formatter";
import { RegisterNotificationTriggerInput } from "./use-cases/register-notification-trigger-types";
import { Trigger, Trigger1, TriggerProps } from "./entities";

export class NotificationTriggersApi {

  private _client: HttpClient;

  constructor() {

    this._client = HttpClientFactory.create('notifications/triggers');
  }

  public async register(args: RegisterNotificationTriggerInput): Promise<TriggerProps> {

    const result = await this._client.post<TriggerProps>('', args);

    if (!result)
      throw new Error('Server did not return results');

    return result;
  }

  public async getAll(args: GetAllArgs): Promise<PagedResult<Trigger1>> {

    const url = UrlFormatter.format('', args);
    const result = await this._client.get<PagedResult<Trigger1>>(url);

    if (!result)
      throw new Error('Server did not return results');

    return result;
  }
}

export interface GetAllArgs extends PagedInput {
  contactId?: string;
}