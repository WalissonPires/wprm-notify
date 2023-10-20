import { PagedInput, PagedResult } from "@/common/http/pagination";
import { HttpClientFactory } from "@/common/http/client/factory";
import { UrlFormatter } from "@/common/http/url/url-formatter";
import { HttpClient } from "@/common/http/client";
import { MessageTemplate, MessageTemplate1 } from "./entities";
import { CreateMessateTemplateInput } from "./use-cases/create-message-template-types";

export class MessageTemplatesApi {

  private _client: HttpClient;

  constructor() {

    this._client = HttpClientFactory.create('message-templates');
  }

  public async getAll(args: PagedInput): Promise<PagedResult<MessageTemplate1>> {

    const url = UrlFormatter.format('', args);
    const result = await this._client.get<PagedResult<MessageTemplate1>>(url);

    if (!result)
      throw new Error('Server did not return results');

    return result;
  }

  public async create(args: CreateMessateTemplateInput): Promise<MessageTemplate> {

    const result = await this._client.post<MessageTemplate>('', args);

    if (!result)
      throw new Error('Server did not return results');

    return result;
  }

  public async delete(id: string): Promise<void> {

    const url = UrlFormatter.format('{id}', { id: id });
    await this._client.delete<void>(url);
  }
}