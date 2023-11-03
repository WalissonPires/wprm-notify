

export class UrlFormatter {

  public static format(url: string, p: UrlParams) {

    const params = { ...p };

    url = url.replace(/{([^\/]+)}/g, (_, uriParam) => {

      const value = params[uriParam];

      if (value === undefined)
        throw new Error(`Value for param ${uriParam} not found`);

      const valueType = typeof value;
      if (valueType !== 'string' && valueType !== 'number' && valueType !== 'boolean')
        throw new Error('Uri params only allow string or number values');

        params[uriParam] = undefined;

      return value.toString();
    });

    const queryString = Object.keys(params ?? {}).reduce((qs, key) => {

      const value = params[key];

      if (value === undefined)
        return qs;

      if (Array.isArray(value)) {

        for(let index = 0; index < value.length; index++) {
          qs = this.appendPairToQuery(qs, `${key}[${index}]`, value[index]);
        }
      }
      else
        qs = this.appendPairToQuery(qs, key, value);

      return qs;
    }, '');

    if (queryString === '')
      return url;

    return url + '?' + queryString;
  }

  private static appendPairToQuery(qs: string, key: string, value: any) {

    const valueType = typeof value;
    if (valueType !== 'string' && valueType !== 'number' && valueType !== 'boolean')
      throw new Error('Query params only allow string or number values');

    const pair = encodeURIComponent(key) + '=' + value;

    if (qs.length > 0)
      qs += '&';

    qs += pair;

    return qs;
  }
}

export interface UrlParams {
  [index: string]: any; //string | number;
}