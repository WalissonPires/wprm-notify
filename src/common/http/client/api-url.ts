
export class ApiUrl {

  public static getBaseUrl() {

    return window.location.origin + '/api';
  }

  public static makeEndpointUrl(endpoint: string) {

    return ApiUrl.getBaseUrl() + '/' + endpoint;
  }
}