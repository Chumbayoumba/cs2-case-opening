import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/navbar';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'CS2 Case Opening',
  description: 'Open CS2 cases and win amazing skins',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <main className="min-h-screen">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
