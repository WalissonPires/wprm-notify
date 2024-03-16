import { AppError } from "@/common/error";
import { HttpClientError } from "./error";

export class HttpClient {

  private _options: HttpClientOptions;

  constructor(options: HttpClientOptions) {

    this._options = options;
  }

  public async get<TResult>(url: string): Promise<TResult | undefined> {

    const { result } = await this.send<TResult>({
      url: url,
      method: 'GET'
    });

    return result;
  }

  public async post<TResult>(url: string, data: any): Promise<TResult | undefined> {

    const { result } = await this.send<TResult>({
      url: url,
      method: 'POST',
      data
    });

    return result;
  }

  public async put<TResult>(url: string, data: any): Promise<TResult | undefined> {

    const { result } = await  this.send<TResult>({
      url: url,
      method: 'PUT',
      data
    });

    return result;
  }

  public async delete<TResult>(url: string): Promise<TResult | undefined> {

    const { result } = await this.send<TResult>({
      url: url,
      method: 'DELETE'
    });

    return result;
  }

  public async head(url: string): Promise<{ headers: HttpClientHeaders }> {

    const { headers } = await this.send({
      url: url,
      method: 'HEAD'
    });

    return {
      headers
    };
  }

  private async send<TResult>(args: SendArgs): Promise<SendResult<TResult>> {

    let slash = !this._options.baseUrl || this._options.baseUrl.endsWith('/') ? '' : '/';
    if (args.url.startsWith('?') || args.url === '')
      slash = '';

    const url = this._options.baseUrl + slash + args.url;

    const headers: Record<string, string> = {};

    const requestOptions: RequestInit = {
      method: args.method
    };

    if (args.data) {
      headers['Content-Type'] = 'application/json';
      requestOptions.body = JSON.stringify(args.data);
    }

    if (this._options.defaultHeaders) {

      for(const headerName in this._options.defaultHeaders) {

        const headerValue = this._options.defaultHeaders[headerName];
        if (!Array.isArray(headerValue))
          continue;

        headers[headerName] = headerValue.join(', ');
      }
    }

    requestOptions.headers = headers;

    const response = await fetch(url, requestOptions);
    let result: any = undefined;

    const contentType = response.headers.get("content-type") ?? '';
    if (contentType.indexOf("application/json") !== -1) {

      result = await response.json();
    }

    if (response.status === 422 && typeof result?.message === 'string') {

      const details = typeof result?.details === 'object' ? result.details : null;
      const error = new AppError(result.message, {
        details: details
      });

      throw error;
    }

    const statusClass = Math.trunc(response.status / 100);
    if (statusClass !== 2) {
      throw new HttpClientError('Server returned status code ' + response.status, response.status);
    }

    return {
      result,
      status: response.status,
      headers: Array.from(response.headers.entries()).reduce((headers, h) => {
        headers[h[0]] = [ h[1] ];
        return headers;
      }, {} as HttpClientHeaders)
    };
  }
}

export interface HttpClientOptions {
  baseUrl: string;
  defaultHeaders?: HttpClientHeaders;
}

export type HttpClientHeaders = Record<string, string[]>;

interface SendArgs {
  url: string;
  method: string;
  data?: string;
}

interface SendResult<TResult> {
  result: TResult | undefined;
  headers: HttpClientHeaders;
  status: number;
}