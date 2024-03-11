/* eslint-disable @next/next/no-img-element */
import { ChangeEvent, useRef, useState } from "react";
import { PaperClipIcon, PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { readFileAsBase64 } from "@/common/primitives/file/file-reader";
import { AppToast } from "@/common/ui/toast";
import { TextArea, Button } from "../Form"

export function MessageEditor({ value, onChange }: MessageEditorProps) {

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleImageSelected = async (event: ChangeEvent<HTMLInputElement>) => {

    const files = Array.from((event.currentTarget as HTMLInputElement)?.files ?? new FileList());

    if (!files?.length)
      return;

    const medias = [ ...value.medias ];
    const oneMegabyte = 1024 * 1024 * 2;

    for(const file of files) {

      if (file.size > oneMegabyte) {
        AppToast.warning('Tamanho máximo permitido: 2 MB');
        return;
      }

      medias.push({
        mimeType: file.type,
        filename: file.name,
        fileBase64: await readFileAsBase64(file)
      });
    }

    onChange?.({
      ...value,
      medias
    });
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
      <li key={index} className="w-full max-w-[50%]">
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
}


function MediaItem({ media, onRequestRemove }: MediaItemProps) {

  let icon: React.ReactNode = <PhotoIcon className="h-10 w-10" />;

  if (media.mimeType.startsWith('image'))
  {
    icon = <img src={`data:${media.mimeType};base64,${media.fileBase64}`}  alt={media.filename} className="h-20 w-auto" />;
  }
  else if (media.mimeType.startsWith('audio'))
  {
    icon = <audio src={`data:${media.mimeType};base64,${media.fileBase64}`} controls />;
  }

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