'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Lock, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { getPrice, formatPrice } from '@/lib/currency';
import { api } from '@/lib/api';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, currency, getSubtotal, clearCart } = useCart();
  const subtotal = getSubtotal();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckout = async () => {
    setLoading(true);
    setError('');

    try {
      const lines = items.map((item) => ({
        variantId: item.variantId,
        quantity: item.quantity,
      }));

      const { checkoutUrl } = await api.checkout.create(lines);
      clearCart();
      window.location.href = checkoutUrl;
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  if (items.length === 0) {
    router.push('/cart');
    return null;
  }

  return (
    <div className="container-page py-8">
      <h1 className="text-2xl font-bold text-brand-midnight">Checkout</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Order review */}
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-gray-100 bg-white p-6">
            <h2 className="mb-4 text-lg font-bold text-gray-900">Review Your Order</h2>
            <div className="space-y-4">
              {items.map((item) => {
                const price = getPrice(item.product, currency);
                return (
                  <div key={item.variantId} className="flex gap-4">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-50">
                      <Image
                        src={item.product.images[0] || '/placeholder.jpg'}
                        alt={item.product.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-1 items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{item.product.name}</p>
                        {item.variantTitle && item.variantTitle !== 'Default' && (
                          <p className="text-xs text-gray-500">{item.variantTitle}</p>
                        )}
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-bold text-brand-midnight">
                        {formatPrice(price * item.quantity, currency)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-6">
            <h2 className="mb-3 text-lg font-bold text-gray-900">What Happens Next</h2>
            <p className="text-sm text-gray-600">
              You&apos;ll be redirected to our secure checkout page powered by Shopify to enter your shipping details and complete payment.
            </p>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-3">
                <ShieldCheck size={18} className="text-brand-cyan" />
                <span className="text-xs font-medium text-gray-700">Secure Payment</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-3">
                <Truck size={18} className="text-brand-cyan" />
                <span className="text-xs font-medium text-gray-700">Free US Shipping</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-3">
                <RotateCcw size={18} className="text-brand-cyan" />
                <span className="text-xs font-medium text-gray-700">30-Day Returns</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
        </div>

        {/* Order summary + pay button */}
        <div className="h-fit space-y-4 rounded-xl border border-gray-100 bg-white p-6">
          <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
              <span>{formatPrice(subtotal, currency)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span className="font-medium text-brand-cyan">Free</span>
            </div>
            <div className="flex justify-between border-t pt-2 text-lg font-bold text-brand-midnight">
              <span>Total</span>
              <span>{formatPrice(subtotal, currency)}</span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="btn-primary w-full text-base disabled:opacity-50"
          >
            <Lock size={16} />
            {loading ? 'Redirecting...' : `Pay ${formatPrice(subtotal, currency)}`}
          </button>

          <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
            <Lock size={12} />
            <span>Secured by Shopify. Your data is encrypted.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
