import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { PropsWithChildren, ReactNode, useState } from "react";


export function Collapse(props: PropsWithChildren & {
  title: ReactNode;
}) {

  const [ showing, setShowing ] = useState(false);

  const toggleContent = () => setShowing(!showing);


  return (
    <div className="border">
      <div className="border-b p-2 flex flex-row justify-between items-center" onClick={toggleContent}>
        {props.title}
        {!showing && <ChevronDownIcon className="w-5 h-5" />}
        {showing && <ChevronUpIcon className="w-5 h-5" />}
      </div>
      {showing &&
      <div className="p-2">
        {props.children}
      </div>}
    </div>
  );
}