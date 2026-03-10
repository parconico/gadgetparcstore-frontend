import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const GA_ID = 'G-H2P84H47DD';

export const metadata: Metadata = {
  verification: {
    google: 'kumw6PUKILIkozQKDwUn7XyTdGnE3_zG7WbPnG0rimE',
  },
  title: {
    default: 'GadgetParc — Upgrade Your Workspace',
    template: '%s | GadgetParc',
  },
  description:
    'Premium tech gear for the modern professional. Home office gadgets, smart lighting, and mechanical keyboards. Free shipping on US orders.',
  keywords: [
    'desk setup',
    'home office',
    'mechanical keyboard',
    'smart lighting',
    'desk accessories',
    'gadgets',
  ],
  openGraph: {
    title: 'GadgetParc — Upgrade Your Workspace',
    description: 'Premium tech gear for the modern professional.',
    url: 'https://gadgetparcstore.com',
    siteName: 'GadgetParc',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>
      </head>
      <body className="flex min-h-screen flex-col bg-white">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
