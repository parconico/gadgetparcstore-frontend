import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { RegisterSW } from '@/components/RegisterSW';

const GA_ID = 'G-H2P84H47DD';
const BASE_URL = 'https://gadgetparcstore.com';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1A1A2E',
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  verification: {
    google: 'kumw6PUKILIkozQKDwUn7XyTdGnE3_zG7WbPnG0rimE',
  },
  title: {
    default: 'GadgetParc — Premium Tech Gear & Desk Accessories | Free US & Canada Shipping',
    template: '%s | GadgetParc',
  },
  description:
    'Shop premium desk accessories, mechanical keyboards, smart lighting & home office gadgets. Free shipping to the United States & Canada. 30-day returns. Upgrade your workspace today.',
  keywords: [
    'desk setup',
    'home office gadgets',
    'mechanical keyboard',
    'smart lighting',
    'desk accessories',
    'tech gadgets',
    'workspace upgrade',
    'office desk accessories',
    'LED desk lamp',
    'ergonomic desk setup',
    'gaming keyboard',
    'desk organizer',
    'work from home essentials',
    'remote work gadgets',
    'productivity tools',
    'desk setup ideas',
    'best desk gadgets 2026',
    'free shipping USA',
    'free shipping Canada',
  ],
  authors: [{ name: 'GadgetParc' }],
  creator: 'GadgetParc',
  publisher: 'GadgetParc',
  formatDetection: { telephone: false },
  alternates: {
    canonical: BASE_URL,
    languages: {
      'en-US': BASE_URL,
      'en-CA': BASE_URL,
    },
  },
  openGraph: {
    title: 'GadgetParc — Premium Tech Gear & Desk Accessories',
    description:
      'Shop premium desk accessories, mechanical keyboards & smart lighting. Free shipping to the US & Canada. 30-day hassle-free returns.',
    url: BASE_URL,
    siteName: 'GadgetParc',
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['en_CA'],
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'GadgetParc — Premium Tech Gear for Your Workspace',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GadgetParc — Premium Tech Gear & Desk Accessories',
    description:
      'Shop premium desk accessories, mechanical keyboards & smart lighting. Free shipping to the US & Canada.',
    images: [`${BASE_URL}/og-image.png`],
    creator: '@gadgetparc',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: 'technology',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${BASE_URL}/#organization`,
      name: 'GadgetParc',
      url: BASE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/logo-color.png`,
      },
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        email: 'support@gadgetparcstore.com',
        availableLanguage: 'English',
        areaServed: ['US', 'CA'],
      },
      sameAs: [],
    },
    {
      '@type': 'WebSite',
      '@id': `${BASE_URL}/#website`,
      url: BASE_URL,
      name: 'GadgetParc',
      publisher: { '@id': `${BASE_URL}/#organization` },
      inLanguage: 'en-US',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${BASE_URL}/categories/home-office?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'Store',
      '@id': `${BASE_URL}/#store`,
      name: 'GadgetParc',
      url: BASE_URL,
      priceRange: '$$',
      currenciesAccepted: 'USD, CAD',
      paymentAccepted: 'Credit Card, PayPal',
      areaServed: [
        { '@type': 'Country', name: 'United States' },
        { '@type': 'Country', name: 'Canada' },
      ],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Tech Gear & Desk Accessories',
        itemListElement: [
          { '@type': 'OfferCatalog', name: 'Home Office' },
          { '@type': 'OfferCatalog', name: 'Smart Lighting' },
          { '@type': 'OfferCatalog', name: 'Mechanical Keyboards' },
        ],
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-US">
      <head>
        <link rel="preconnect" href="https://cdn.shopify.com" />
        <link rel="dns-prefetch" href="https://cdn.shopify.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}', {
              page_path: window.location.pathname,
              cookie_flags: 'SameSite=None;Secure',
            });
          `}
        </Script>
      </head>
      <body className="flex min-h-screen flex-col bg-white">
        <RegisterSW />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
