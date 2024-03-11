

export function readFileAsText(file: Blob): Promise<string> {

  return new Promise((resolve, reject) => {

    var reader = new FileReader();

    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}


export function readFileAsBase64(file: Blob): Promise<string> {

  return new Promise((resolve, reject) => {

    var reader = new FileReader();

    reader.onload = () => {

      const dataUrl = reader.result as string;
      const base64Index = dataUrl.indexOf('base64,');
      if (base64Index === -1)
        throw new Error('invalid data url');

      const base64StartIndex = base64Index + 7;
      const base64Only = dataUrl.substring(base64StartIndex);
      resolve(base64Only);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function readFileAsDataUrl(file: Blob, dataPrefix: boolean): Promise<string> {

  return new Promise((resolve, reject) => {

    var reader = new FileReader();

    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}