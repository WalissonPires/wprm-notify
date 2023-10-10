
export class HttpClient {

  private _options: HttpClientOptions;

  constructor(options: HttpClientOptions) {

    this._options = options;
  }

  public get<TResult>(url: string): Promise<TResult | undefined> {

    return this.send({
      url: url,
      method: 'GET'
    });
  }

  public post<TResult>(url: string, data: any): Promise<TResult | undefined> {

    return this.send({
      url: url,
      method: 'POST',
      data
    });
  }

  public put<TResult>(url: string, data: any): Promise<TResult | undefined> {

    return this.send({
      url: url,
      method: 'PUT',
      data
    });
  }

  public delete<TResult>(url: string): Promise<TResult | undefined> {

    return this.send<TResult>({
      url: url,
      method: 'DELETE'
    });
  }

  private async send<TResult>(args: SendArgs): Promise<TResult | undefined> {

    let slash = this._options.baseUrl.endsWith('/') ? '' : '/';
    if (args.url.startsWith('?'))
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

    if (response.status / 100 !== 2)
      throw new Error('Server returned status code ' + response.status);

    // const contentLength = response.headers.get("content-length");
    // if (!contentLength || contentLength === '0')
    //   return;

    const contentType = response.headers.get("content-type") ?? '';

    if (contentType.indexOf("application/json") !== -1) {

      const result = await response.json();
      return result as TResult;
    }

    return undefined;
  }
}

export interface HttpClientOptions {
  baseUrl: string;
  defaultHeaders?: Record<string, string[]>;
}

interface SendArgs {
  url: string;
  method: string;
  data?: string;
}