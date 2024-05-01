import { sortAsc } from "../array/sort-utils";

export const getEnumPairValue = (enum2: Object) => {

  return Object.keys(enum2).map(key => ({ value: key, text: (enum2 as any)[key] })).sort((a, b) => sortAsc(a.text, b.text));
}