import type { Metadata } from 'next';
import { EB_Garamond, Jost, Noto_Sans_Devanagari } from 'next/font/google';
import './globals.css';

const jost = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-jost',
});

const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-eb-garamond',
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
      <body className={`${jost.variable} ${ebGaramond.variable} ${notoDevanagari.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
