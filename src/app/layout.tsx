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
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
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
