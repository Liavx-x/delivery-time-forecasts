
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
// import { GeistMono } from 'geist/font/mono'; // No longer used, can be removed if not needed elsewhere
import './globals.css';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Tiempo de entrega estimado (DULCAR S.A.S)',
  description: 'Predice los tiempos de entrega para tus pedidos.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          GeistSans.variable
          // GeistMono.variable // No longer used
        )}
      >
        {children}
      </body>
    </html>
  );
}
