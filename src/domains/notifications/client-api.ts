import { HttpClientFactory } from "@/common/http/client/factory";
import { HttpClient } from "@/common/http/client";
import { PagedInput, PagedResult } from "@/common/http/pagination";
import { UrlFormatter } from "@/common/http/url/url-formatter";
import { Notification1 } from "./use-cases/entities";

export class NotificationsApi {

  private _client: HttpClient;

  constructor() {

    this._client = HttpClientFactory.create('notifications');
  }

  public async getAll(args: GetAllArgs): Promise<PagedResult<Notification1>> {

    const url = UrlFormatter.format('', args);
    const result = await this._client.get<PagedResult<Notification1>>(url);

    if (!result)
      throw new Error('Server did not return results');

    return result;
  }

  public async cancel(id: string): Promise<void> {

    const url = UrlFormatter.format('{id}', { id });
    await this._client.delete<void>(url);
  }
}

export interface GetAllArgs extends PagedInput {
  contactId?: string;
  isSended?: boolean;
}