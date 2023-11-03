

export class URLSearchParamsParser {

  public static toObject(params: URLSearchParams) {

    const values = Object.fromEntries(params.entries());
    const result: Record<string, string[]> = {};

    const arrayPropRegex = /^(\w+)\[\d+\]$/;

    for(const key in values) {

      const match = arrayPropRegex.exec(key);

      if (!match) {

        result[key] = [ values[key]?.toString() ?? '' ];
        continue;
      }

      const segment = match[1];
      if (!result[segment])
        result[segment] = [];

      result[segment].push(values[key]?.toString() ?? '');
    }

    return result;
  }
}