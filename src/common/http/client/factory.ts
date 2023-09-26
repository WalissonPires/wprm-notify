import { HttpClient } from ".";

export class HttpClientFactory {

  public static create(endpoint: string): HttpClient {

    return new HttpClient({
      baseUrl: window.location.href + 'api/' + endpoint
    });
  }
}