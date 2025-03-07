import type { Metadata } from 'next';
import { Press_Start_2P } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import '@/styles/globals.css';

const pressStart2p = Press_Start_2P({
  variable: '--font-press-start-2p',
  subsets: ['latin'],
  weight: '400',
});

export const metadata: Metadata = {
  title: 'Neverending Stories',
  description: 'AI Generated choose-your-own-adventure stories',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${pressStart2p.variable} antialiased pb-12`}>
        <div className="mt-8 md:mt-12 max-w-screen-md mx-auto px-4">
          <main>{children}</main>
        </div>
        <Analytics />
      </body>
    </html>
  );
}
