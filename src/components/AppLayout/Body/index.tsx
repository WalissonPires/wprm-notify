import { PropsWithChildren } from "react";

export function AppLayoutBody({ children }: PropsWithChildren) {

  return (
    <div className="flex-1">
      {children}
    </div>
  );
}