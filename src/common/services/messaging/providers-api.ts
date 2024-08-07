import { AppConfig } from "../../configuration";
import { HttpClient } from "../../http/client";
import { UrlFormatter } from "../../http/url/url-formatter";
import { ChatbotStatus, ChatNode, IProviderConfig, Provider, ProviderType, ProviderWithStatus } from "./models";


export class ProvidersApi {

  private _client: HttpClient;

  constructor(ops: { accessToken: string }) {

    const config = new AppConfig();
    this._client = new HttpClient({
      baseUrl: UrlFormatter.join(config.SendMessageApiUrl(), 'providers'),
      defaultHeaders: {
        'Authorization': [ 'Bearer ' + ops.accessToken ]
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

  public async finalize(args: FinalizeArgs) {

    const url = UrlFormatter.format('{id}/finalize', { id: args.id });
    return await this._client.post<Provider[]>(url, undefined);
  }

  public async getChatbotFlow(args: GetChatbotFlowArgs) {

    const url = UrlFormatter.format('{id}/chatbot-flow', { id: args.id });
    return await this._client.get<ChatNode>(url) ?? null;
  }

  public async updateChatbotFlow({ id, ...args }: UpdateChatbotFlowArgs) {

    const url = UrlFormatter.format('{id}/chatbot-flow', { id: id });
    return await this._client.put<ChatNode>(url, args) ?? null;
  }

  public async getChatbotStatus(args: GetChatbotStatusArgs) {

    const url = UrlFormatter.format('{id}/chatbot-status', { id: args.id });
    return await this._client.get<ChatbotStatus>(url) ?? null;
  }

  public async updateChatbotStatus({ id, ...args }: UpdateChatbotStatusArgs) {

    const url = UrlFormatter.format('{id}/chatbot-status', { id: id });
    return await this._client.put<void>(url, args) ?? null;
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

export interface FinalizeArgs {
  id: number;
}

export interface GetStatusArgs {
  id?: number;
}

export interface GetChatbotFlowArgs {
  id: number;
}

export interface UpdateChatbotFlowArgs {
  id: number;
  chatbotFlow: ChatNode;
}

export interface GetChatbotStatusArgs {
  id: number;
}

export interface UpdateChatbotStatusArgs {
  id: number;
  active: boolean;
}