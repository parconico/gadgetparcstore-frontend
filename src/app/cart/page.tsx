'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { getPrice, formatPrice } from '@/lib/currency';

export default function CartPage() {
  const { items, currency, removeItem, updateQuantity, getSubtotal, getItemCount } = useCart();
  const subtotal = getSubtotal();
  const itemCount = getItemCount();

  if (items.length === 0) {
    return (
      <div className="container-page flex flex-col items-center justify-center py-24 text-center">
        <ShoppingBag size={64} className="mb-4 text-gray-300" />
        <h1 className="text-2xl font-bold text-gray-900">Your cart is empty</h1>
        <p className="mt-2 text-gray-500">Looks like you haven&apos;t added anything yet.</p>
        <Link href="/" className="btn-primary mt-6">
          <ArrowLeft size={18} /> Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-8">
      <h1 className="text-2xl font-bold text-brand-midnight">
        Shopping Cart <span className="text-lg font-normal text-gray-500">({itemCount} items)</span>
      </h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const price = getPrice(item.product, currency);
            return (
              <div
                key={item.variantId}
                className="flex gap-4 rounded-xl border border-gray-100 bg-white p-4"
              >
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-50">
                  <Image
                    src={item.product.images[0] || '/placeholder.jpg'}
                    alt={item.product.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>

                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="text-sm font-semibold text-gray-900 hover:text-brand-cyan"
                    >
                      {item.product.name}
                    </Link>
                    <div className="mt-0.5 flex items-center gap-2">
                      <p className="text-xs text-gray-500">
                        {item.product.category?.name}
                      </p>
                      {item.variantTitle && item.variantTitle !== 'Default' && (
                        <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[11px] font-medium text-gray-600">
                          {item.variantTitle}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center rounded-lg border border-gray-200">
                      <button
                        onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                        className="px-2.5 py-1.5 text-gray-500 hover:text-gray-900"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                        className="px-2.5 py-1.5 text-gray-500 hover:text-gray-900"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-brand-midnight">
                        {formatPrice(price * item.quantity, currency)}
                      </span>
                      <button
                        onClick={() => removeItem(item.variantId)}
                        className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="h-fit rounded-xl border border-gray-100 bg-white p-6">
          <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal, currency)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span className="font-medium text-brand-cyan">Free</span>
            </div>
            <div className="border-t pt-3">
              <div className="flex justify-between text-lg font-bold text-brand-midnight">
                <span>Total</span>
                <span>{formatPrice(subtotal, currency)}</span>
              </div>
            </div>
          </div>
          <Link href="/checkout" className="btn-primary mt-6 w-full text-base">
            Proceed to Checkout
          </Link>
          <Link
            href="/"
            className="mt-3 flex items-center justify-center gap-1 text-sm text-gray-500 hover:text-brand-cyan"
          >
            <ArrowLeft size={14} /> Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
