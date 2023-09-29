import { PropsWithChildren } from "react";


export function AppLayoutTabs({ children }: PropsWithChildren) {

  return (
    <div className="h-auto w-full bg-green-500 text-white">
      <nav className="flex flex-row justify-around max-w-sm mx-auto text-xs">
        {children}
      </nav>
    </div>
  );
}