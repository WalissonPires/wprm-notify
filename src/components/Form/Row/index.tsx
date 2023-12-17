import { PropsWithChildren } from "react";

export function FormRow({ children }: PropsWithChildren) {

  return (
    <div className="grid grid-cols-4 -mx-3 mb-6">{children}</div>
  );
}