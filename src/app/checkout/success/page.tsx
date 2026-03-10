import Link from 'next/link';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';

export default async function CheckoutSuccessPage() {
  return (
    <div className="container-page flex flex-col items-center justify-center py-24 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
        <CheckCircle size={40} className="text-green-600" />
      </div>
      <h1 className="mt-6 text-3xl font-bold text-brand-midnight">Order Confirmed!</h1>
      <p className="mt-3 max-w-md text-gray-500">
        Thank you for your purchase. We&apos;re preparing your order and you&apos;ll receive a shipping confirmation with tracking details via email.
      </p>

      <div className="mt-6 flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-700">
        <Package size={18} />
        Estimated delivery: 7-15 business days (US)
      </div>

      <Link href="/" className="btn-primary mt-8">
        Continue Shopping <ArrowRight size={18} />
      </Link>
    </div>
  );
}
