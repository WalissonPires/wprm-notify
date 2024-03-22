import { HttpClient } from "@/common/http/client";
import { HttpClientFactory } from "@/common/http/client/factory";
import { UrlFormatter } from "@/common/http/url/url-formatter";
import { Provider, ProviderWithStatus } from "@/common/services/messaging/models";

export class MessageProvidersApi {

  private _client: HttpClient;

  constructor() {

    this._client = HttpClientFactory.create('message-providers');
  }

  public async getProvidersStatus(args?: { id?: number }): Promise<ProviderWithStatus[]> {

    const url = UrlFormatter.format('status', { id: args?.id });
    const result = await this._client.get<ProviderWithStatus[]>(url);

    if (!result)
      throw new Error('Server did not return results');

    return result;
  }

  public async createWhatsappProvider(): Promise<Provider> {

    const result = await this._client.post<Provider>('', null);

    if (!result)
      throw new Error('Server did not return results');

    return result;
  }

  public async initProvider(args: { id : number }): Promise<void> {

    const url = UrlFormatter.format('{id}/init', { id: args.id });
    await this._client.post<Provider>(url, null);
  }

  public async finalizeProvider(args: { id : number }): Promise<void> {

    const url = UrlFormatter.format('{id}/finalize', { id: args.id });
    await this._client.post<Provider>(url, null);
  }
}