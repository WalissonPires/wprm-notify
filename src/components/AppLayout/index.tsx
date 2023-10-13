import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

export function AppLayout({ children }: AppLayoutProps) {

  return (
    <main className="h-screen w-screen overflow-x-hidden flex flex-col bg-stone-50">
      {children}
      <ToastContainer
        position="bottom-center" />
    </main>
  );
}

export interface AppLayoutProps {
  children: React.ReactNode;
}