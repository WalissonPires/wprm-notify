import { PropsWithChildren } from "react";

export function FormRow({ children }: PropsWithChildren) {

  return (
    <div className="flex flex-wrap -mx-3 mb-6">{children}</div>
  );
}