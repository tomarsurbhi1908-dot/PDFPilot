import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'PDFpaglu - Free Online PDF Tools',
    template: '%s - PDFpaglu',
  },
  metadataBase: new URL('https://pdfpaglu.in'),
  description: 'Merge, split, compress, watermark and convert PDFs online. No signup, no watermarks, completely free.',
  keywords: ['pdf merge', 'pdf split', 'compress pdf', 'image to pdf', 'pdf tools online', 'free pdf converter', 'word to pdf', 'watermark pdf'],
  openGraph: {
    title: 'PDFpaglu - Free Online PDF Tools',
    description: 'Merge, split, compress, watermark and convert PDFs. No signup required.',
    url: 'https://pdfpaglu.in',
    siteName: 'PDFpaglu',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PDFpaglu - Free Online PDF Tools',
    description: 'Free online PDF tools for merge, split, compress and more.',
  },
  robots: 'index, follow',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
