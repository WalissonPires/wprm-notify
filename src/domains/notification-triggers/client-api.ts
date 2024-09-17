import { HttpClientFactory } from "@/common/http/client/factory";
import { HttpClient } from "@/common/http/client";
import { PagedInput, PagedResult } from "@/common/http/pagination";
import { UrlFormatter } from "@/common/http/url/url-formatter";
import { RegisterNotificationTriggerInput } from "./use-cases/register-notification-trigger-types";
import { UpdateNotificationTriggerInput } from "./use-cases/update-notification-trigger-types";
import { Trigger1, TriggerProps } from "./entities";

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

  public async update(args: UpdateNotificationTriggerInput): Promise<TriggerProps> {

    const url = UrlFormatter.format('{id}', { id: args.triggerId });
    const result = await this._client.put<TriggerProps>(url, args);

    if (!result)
      throw new Error('Server did not return results');

    return result;
  }

  public async getById(args: GetByIdArgs): Promise<Trigger1> {

    const url = UrlFormatter.format('{id}', args);
    const result = await this._client.get<Trigger1>(url);

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

  public async delete(id: string): Promise<void> {

    const url = UrlFormatter.format('{id}', { id: id });
    await this._client.delete<void>(url);
  }
}

export interface GetByIdArgs {
  id: string;
}

export interface GetAllArgs extends PagedInput {
  contactId?: string;
}