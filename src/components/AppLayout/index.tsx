import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

export function AppLayout({ children }: AppLayoutProps) {

  return (
    <main className="h-dvh w-screen overflow-hidden flex flex-col bg-stone-50" style={{ height: '100dvh' }}>
      {children}
      <ToastContainer
        position="bottom-center" />
    </main>
  );
}

export interface AppLayoutProps {
  children: React.ReactNode;
}