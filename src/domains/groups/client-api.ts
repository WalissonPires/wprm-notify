import { PagedInput, PagedResult } from "@/common/http/pagination";
import { HttpClientFactory } from "@/common/http/client/factory";
import { UrlFormatter } from "@/common/http/url/url-formatter";
import { HttpClient } from "@/common/http/client";
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
}

export interface GetAllArgs extends PagedInput {
}