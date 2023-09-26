
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

    const slash = this._options.baseUrl.endsWith('/') ? '' : '/';
    const url = this._options.baseUrl + slash + args.url;

    const response = await fetch(url, {
      method: args.method,
      body: args.data ? JSON.stringify(args.data) : undefined
    });

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

    throw new Error('Unhandled content type ' + contentType);
  }
}

export interface HttpClientOptions {
  baseUrl: string;
}

interface SendArgs {
  url: string;
  method: string;
  data?: string;
}