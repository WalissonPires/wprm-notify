
export function AppLayout({ children }: AppLayoutProps) {

  return (
    <main className="h-screen w-screen overflow-x-hidden flex flex-col bg-stone-50">
      {children}
    </main>
  );
}

export interface AppLayoutProps {
  children: React.ReactNode;
}