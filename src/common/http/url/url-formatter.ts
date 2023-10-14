

export class UrlFormatter {

  public static format(url: string, params: UrlParams) {

    url = url.replace(/{([^\/]+})/g, match => {

      const uriParam = match[1];
      const value = params[uriParam];

      if (value === undefined)
        throw new Error(`Value for param ${uriParam} not found`);

      const valueType = typeof value;
      if (valueType !== 'string' && valueType !== 'number' && valueType !== 'boolean')
        throw new Error('Uri params only allow string or number values');

      return value.toString();
    });

    const queryString = Object.keys(params ?? {}).reduce((qs, key) => {

      const value = params[key];

      if (value === undefined)
        return qs;

      const valueType = typeof value;
      if (valueType !== 'string' && valueType !== 'number' && valueType !== 'boolean')
        throw new Error('Query params only allow string or number values');

      const pair = encodeURIComponent(key) + '=' + value;

      if (qs.length > 0)
        qs += '&';

      qs += pair;

      return qs;
    }, '');

    if (queryString === '')
      return url;

    return url + '?' + queryString;
  }
}

export interface UrlParams {
  [index: string]: any; //string | number;
}