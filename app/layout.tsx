import type { Metadata } from 'next';
import { Cormorant_Garamond, DM_Sans, Noto_Sans_Devanagari } from 'next/font/google';
import './globals.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm-sans',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
});

const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ['devanagari'],
  weight: ['400', '500'],
  variable: '--font-devanagari',
});

export const metadata: Metadata = {
  title: 'Yaatri',
  description: 'Yatra begins within.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${cormorant.variable} ${notoDevanagari.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
