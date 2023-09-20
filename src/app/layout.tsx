import './globals.css';

import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import AppLayout from '../components/AppLayout';

const inter = Poppins({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: 'Wprm Notify',
  description: 'WebApp para notificações',
};

export default function RootLayout({ children }: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppLayout>
          {children}
        </AppLayout>
      </body>
    </html>
  )
}