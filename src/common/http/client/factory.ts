import { HttpClient } from ".";
import { ApiUrl } from "./api-url";

export class HttpClientFactory {

  public static create(endpoint: string | null): HttpClient {

    return new HttpClient({
      baseUrl: endpoint === null ? '' : ApiUrl.makeEndpointUrl(endpoint)
    });
  }
}