import Link from 'next/link';
import { WifiOff, RefreshCw } from 'lucide-react';

export const metadata = {
  title: 'Offline — GadgetParc',
};

export default function OfflinePage() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
        <WifiOff size={32} className="text-gray-400" />
      </div>
      <h1 className="mt-6 text-3xl font-bold text-brand-midnight">You&apos;re Offline</h1>
      <p className="mt-3 max-w-md text-gray-500">
        It looks like you&apos;ve lost your internet connection. Check your connection and try
        again.
      </p>
      <Link
        href="/"
        className="btn-primary mt-8"
      >
        <RefreshCw size={18} />
        Try Again
      </Link>
    </div>
  );
}
