export function getBase64BytesSize(base4: string) {

  return base4.length / 4 * 3;
}

export function megaToBytes(megabytes: number) {

  return megabytes * 1024 * 1024;
}

export function bytesToFormattedString(bytes: number) {

   if (bytes < 1024)
    return bytes + ' B';

  const kiloBytes = bytes / 1024;
  if (kiloBytes < 1024)
    return kiloBytes + ' KB';

  const megaBytes = kiloBytes / 1024;
  if (megaBytes < 1024)
    return megaBytes + ' MB';

  const gigaBytes = megaBytes / 1024;
  if (gigaBytes < 1024)
    return gigaBytes + ' GB';

  return bytes + ' B';
}