import { PagedInput, PagedResult } from "@/common/http/pagination";
import { HttpClientFactory } from "@/common/http/client/factory";
import { UrlFormatter } from "@/common/http/url/url-formatter";
import { HttpClient } from "@/common/http/client";
import { Contact } from "./entities";
import { CreateContactInput } from "./use-cases/create-contact-types";
import { UpdateContactInput } from "./use-cases/update-contact-types";

export class ContactsApi {

  private _client: HttpClient;

  constructor() {

    this._client = HttpClientFactory.create('contacts');
  }

  public async getById(id: string): Promise<Contact> {

    const url = UrlFormatter.format('{id}', { id: id });
    const result = await this._client.get<Contact>(url);

    if (!result)
      throw new Error('Server did not return results');

    return result;
  }

  public async getAll(args: GetAllArgs): Promise<PagedResult<Contact>> {

    const url = UrlFormatter.format('', args);
    const result = await this._client.get<PagedResult<Contact>>(url);

    if (!result)
      throw new Error('Server did not return results');

    return result;
  }

  public async create(args: CreateContactInput): Promise<Contact> {

    const result = await this._client.post<Contact>('', args);

    if (!result)
      throw new Error('Server did not return results');

    return result;
  }

  public async update(args: UpdateContactInput): Promise<Contact> {

    const { id } = args.contact;

    const url = UrlFormatter.format('{id}', { id: id });
    const result = await this._client.put<Contact>(url, args);

    if (!result)
      throw new Error('Server did not return results');

    return result;
  }

  public async delete(id: string): Promise<void> {

    const url = UrlFormatter.format('{id}', { id: id });
    await this._client.delete<void>(url);
  }
}

export interface GetAllArgs extends PagedInput {
  query?: string;
  groupsId?: string[];
}