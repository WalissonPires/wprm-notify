import { PropsWithChildren } from "react";


export function AppLayoutHeader({ children }: PropsWithChildren) {

  return (
    <header className="h-auto w-full bg-green-500 text-white p-4">
      {children}
    </header>
  );
}
