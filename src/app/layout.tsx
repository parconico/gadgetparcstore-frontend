import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
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
      <body className="flex min-h-screen flex-col bg-white">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
