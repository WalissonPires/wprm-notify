import { PagedInput, PagedResult } from "@/common/http/pagination";
import { HttpClientFactory } from "@/common/http/client/factory";
import { UrlFormatter } from "@/common/http/url/url-formatter";
import { HttpClient } from "@/common/http/client";
import { CreateGroupInput } from "./use-cases/create-group-types";
import { UpdateGroupInput } from "./use-cases/update-group-types";
import { Group } from "./entities";

export class GroupsApi {

  private _client: HttpClient;

  constructor() {

    this._client = HttpClientFactory.create('groups');
  }

  public async getAll(args: GetAllArgs): Promise<PagedResult<Group>> {

    const url = UrlFormatter.format('', args);
    const result = await this._client.get<PagedResult<Group>>(url);

    if (!result)
      throw new Error('Server did not return results');

    return result;
  }


  public async getById(id: string): Promise<Group> {

    const url = UrlFormatter.format('{id}', { id });
    const result = await this._client.get<Group>(url);

    if (!result)
      throw new Error('Server did not return results');

    return result;
  }

  public async create(args: CreateGroupInput): Promise<Group> {

    const result = await this._client.post<Group>('', args);

    if (!result)
      throw new Error('Server did not return results');

    return result;
  }

  public async update(args: UpdateGroupInput): Promise<Group> {

    const url = UrlFormatter.format('{id}', { id: args.group.id });
    const result = await this._client.put<Group>(url, args);

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
}