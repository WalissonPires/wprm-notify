import { AppConfig } from "../../configuration";
import { HttpClient } from "../../http/client";
import { UrlFormatter } from "../../http/url/url-formatter";
import { IProviderConfig, Provider, ProviderType, ProviderWithStatus } from "./models";


export class ProvidersApi {

  private _client: HttpClient;

  constructor() {

    const config = new AppConfig();
    this._client = new HttpClient({
      baseUrl: UrlFormatter.join(config.SendMessageApiUrl(), 'providers'),
      defaultHeaders: {
        'Authorization': [ config.SendMessageApiToken() ]
      }
    });
  }

  public async create(args: ProviderCreateArgs) {

    return await this._client.post<Provider>('', {
      provider: args.provider
    });
  }

  public async getStatus(args: GetStatusArgs) {

    const url = args.id ? UrlFormatter.format('status/{id}', { id: args.id }) : 'status';
    return await this._client.get<ProviderWithStatus[]>(url);
  }

  public async getAll() {

    return await this._client.get<Provider[]>('');
  }

  public async getById (args: GetByIdArgs) {

    return await this._client.get<Provider[]>(args.id.toString());
  }

  public async initialize(args: InitializeArgs) {

    const url = UrlFormatter.format('{id}/init', { id: args.id });
    return await this._client.post<Provider[]>(url, undefined);
  }
}

export interface ProviderCreateArgs {
  provider: {
    name: string;
    type: ProviderType;
    config: IProviderConfig;
  }
}


export interface GetByIdArgs {
  id: number;
}


export interface InitializeArgs {
  id: number;
}

export interface GetStatusArgs {
  id?: number;
}