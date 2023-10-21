
type Item = string | number | boolean | Date;

export const sortAsc = (a: Item, b: Item): number => a > b ? 1 : a < b ? -1 : 0;
export const sortDesc = (a: Item, b: Item): number => a > b ? -1 : a < b ? 1 : 0;