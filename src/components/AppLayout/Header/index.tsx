import { PropsWithChildren } from "react";


export function AppLayoutHeader({ children }: PropsWithChildren) {

  return (
    <header className="flex justify-between h-auto w-full bg-green-500 text-white p-4 relative">
      {children}
    </header>
  );
}
