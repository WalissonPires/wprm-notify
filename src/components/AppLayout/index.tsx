import Link from 'next/link';
import { Bars3Icon } from '@heroicons/react/24/outline';

export default function AppLayout({ children }: AppLayoutProps) {

  return (
    <main className="h-screen w-screen flex flex-col bg-stone-50">
      <header className="h-auto w-full bg-green-500 text-white p-4 pb-0 border-b">
        <div className="flex items-center">
          <Bars3Icon className="h-5 w-5 mr-4 cursor-pointer hover:scale-110" title="Menu" />
          <h1 className="text-base inline-block">Wprm Notify</h1>
        </div>
        <nav className="flex flex-row justify-around max-w-sm mx-auto text-xs">
          <Link href="/" className="p-4 border-b-4 border-white" title="Contatos">
            Contatos
          </Link>
          <Link href="/events" className="p-4 opacity-75" title="Eventos">
            Eventos
          </Link>
          <Link href="/template-messages" className="p-4 opacity-75" title="Mensagens">
            Mensagens
          </Link>
        </nav>
      </header>
      <div className="flex-1">
        {children}
      </div>
    </main>
  );
}

export interface AppLayoutProps {
  children: React.ReactNode;
}