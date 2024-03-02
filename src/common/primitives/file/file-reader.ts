

export function readFileAsText(file: Blob): Promise<string> {

  return new Promise((resolve, reject) => {

    var reader = new FileReader();

    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}