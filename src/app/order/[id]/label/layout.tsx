import type { Metadata } from 'next';
import '@/app/globals.css';
import { OrdersProvider } from '@/context/orders-context';

export const metadata: Metadata = {
  title: 'Print Shipping Label',
  description: 'Print-friendly shipping label.',
};

export default function LabelLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
         <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <OrdersProvider>
          {children}
        </OrdersProvider>
      </body>
    </html>
  );
}
