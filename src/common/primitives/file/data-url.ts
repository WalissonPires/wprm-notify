
export function parseDataUrl(dataUrl: string): DataUrlMetadata | null {

  const match = /^data:([^;]+);base64,(.+)$/.exec(dataUrl);
  if (!match)
    return null;

  return {
    mimeType: match[1],
    base64: match[2]
  };
}

export function makeDataUrl(data: DataUrlMetadata) {

  return `data:${data.mimeType};base64,${data.base64}`;
}

interface DataUrlMetadata {
  mimeType: string;
  base64: string;
}