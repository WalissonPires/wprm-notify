

export function parseBool(boolValue: string | undefined | null) {

  return boolValue?.toLowerCase() === 'true';
}