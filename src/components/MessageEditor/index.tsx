/* eslint-disable @next/next/no-img-element */
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { DocumentTextIcon, PaperClipIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { readFileAsBase64 } from "@/common/primitives/file/file-reader";
import { AppToast } from "@/common/ui/toast";
import { TextArea, Button } from "../Form"
import { bytesToFormattedString, getBase64BytesSize, megaToBytes } from "@/common/primitives/file/file-size";
import { requestBodyMaxSize } from "@/common/services/messaging/models";
import { makeDataUrl } from "@/common/primitives/file/data-url";
import { HttpClientFactory } from "@/common/http/client/factory";
import { AppError } from "@/common/error";

export function MessageEditor({ value, onChange }: MessageEditorProps) {

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleImageSelected = async (event: ChangeEvent<HTMLInputElement>) => {

    try {
      const files = Array.from((event.currentTarget as HTMLInputElement)?.files ?? new FileList());

      if (!files?.length)
        return;

      const maxFilesSize = requestBodyMaxSize - megaToBytes(1);
      const medias = [ ...value.medias ];

      for(const file of files) {

        if (file.size > maxFilesSize) {

          AppToast.warning('O arquivo selecionado ultrapassam o limite de ' + bytesToFormattedString(maxFilesSize));
          return;
        }

        const base64 = await readFileAsBase64(file);

        medias.push({
          mimeType: file.type,
          filename: file.name,
          fileBase64: base64,
          fileSize: getBase64BytesSize(base64)
        });
      }

      const filesSize = medias.reduce((bytesTotal, media) => bytesTotal + media.fileSize, 0);
      if (filesSize > maxFilesSize) {

        AppToast.warning('O tamanho de todos os arquivos juntos ultrapassam o limite de ' + bytesToFormattedString(maxFilesSize));
        return;
      }

      onChange?.({
        ...value,
        medias
      });
    }
    catch(error) {
      AppToast.error(AppError.parse(error).message);
    }
  };

  const handleRemoveMedia = (media: Media) => () => {

    onChange?.({
      ...value,
      medias: value.medias.filter(x => x !== media)
    });

  };

  const handleContentChange = (event: ChangeEvent<HTMLTextAreaElement>) => {

    onChange?.({
      ...value,
      content: event.currentTarget.value
    });
  };

  return (
  <div className="flex flex-col">
    <input ref={inputRef} onChange={handleImageSelected} type="file" accept="image/*,audio/mpeg,video/mp4" className="hidden" />
    <TextArea rows={4} value={value.content} onChange={handleContentChange} />
    <div className="flex flex-row justify-start mt-3">
      <Button variant="transparent" className="mr-3" type="button" title="Adicionar arquivo" onClick={() => inputRef.current?.click()}><PaperClipIcon className="h-5 w-5" /></Button>
    </div>
    <ul className="flex flex-row flex-wrap mt-3">
    {value.medias.map((media, index) =>
      <li key={index} className="w-full sm:max-w-[50%]">
        <MediaItem media={media} onRequestRemove={handleRemoveMedia(media)} />
      </li>)}
    </ul>
  </div>);
}

export interface MessageEditorProps {
  value: MessageEditorValue;
  onChange?: (value: MessageEditorValue) => void;
}

interface MessageEditorValue {
  content: string;
  medias: Media[];
}


interface Media {
  mimeType: string;
  filename: string;
  fileBase64: string;
  fileSize: number;
  fileUrl?: string;
}


function MediaItem({ media, onRequestRemove }: MediaItemProps) {

  const [ mimeType, setMimeType ] = useState<string>(media.mimeType ?? '');

  let icon: React.ReactNode = media.fileUrl ? <a href={media.fileUrl} target="_blank"><DocumentTextIcon className="h-10 w-10" /></a> : <DocumentTextIcon className="h-10 w-10" />;

  if (mimeType.startsWith('image'))
  {
    icon = <img src={media.fileUrl ?? makeDataUrl({ mimeType: mimeType, base64: media.fileBase64 })}  alt={media.filename} className="h-20 w-auto" />;
  }
  else if (mimeType.startsWith('audio'))
  {
    icon = <audio src={media.fileUrl ?? makeDataUrl({ mimeType: mimeType, base64: media.fileBase64 })} controls />;
  }
  else if (mimeType.startsWith('video'))
  {
    icon = <video src={media.fileUrl ?? makeDataUrl({ mimeType: mimeType, base64: media.fileBase64 })} controls />;
  }

  useEffect(() => {

    if (!media.fileUrl)
      return;

      const fileUrl = media.fileUrl;

      (async() => {

        try {
          const client = HttpClientFactory.create(null);
          const { headers } = await client.head(fileUrl);
          const contentType = headers['content-type'];
          setMimeType(contentType?.at(0) ?? '');
        }
        catch(error) {
          AppToast.error(AppError.parse(error).message);
        }

      })();

  }, [ media.fileUrl ]);

  return (
    <div className="flex flex-col items-center p-3 relative">
      {icon}
      {media.filename}
      <Button variant="textOnly" onClick={() => onRequestRemove()}><XMarkIcon className="h-5 w-5 absolute top-1 right-1 opacity-70 hover:opacity-100" /></Button>
    </div>
  );
}

interface MediaItemProps {
  media: Media;
  onRequestRemove: () => void;
}