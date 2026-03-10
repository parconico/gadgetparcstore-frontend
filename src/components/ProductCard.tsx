'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/hooks/useCart';
import { getPrice, formatPrice, getDiscount, formatPriceRange } from '@/lib/currency';
import { ProductCardCarousel } from './ProductCardCarousel';

export function ProductCard({ product }: { product: Product }) {
  const { addItem, currency } = useCart();
  const price = getPrice(product, currency);
  const discount = getDiscount(product);
  const hasVariants = product.hasMultipleVariants;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white transition-shadow hover:shadow-lg">
      {/* Badge */}
      {discount && !hasVariants && (
        <span className="absolute left-3 top-3 z-10 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
          -{discount}%
        </span>
      )}
      {product.isFeatured && (
        <span className="absolute right-3 top-3 z-10 rounded-full bg-brand-cyan px-2 py-0.5 text-[10px] font-bold text-white">
          Best Seller
        </span>
      )}
      {hasVariants && (
        <span className="absolute left-3 top-3 z-10 rounded-full bg-brand-midnight/80 px-2 py-0.5 text-[10px] font-bold text-white">
          {product.variants.length} options
        </span>
      )}

      {/* Image carousel */}
      <Link href={`/products/${product.slug}`} className="block">
        <ProductCardCarousel images={product.images} alt={product.name} />
      </Link>

      {/* Info */}
      <div className="flex flex-1 flex-col p-4">
        {product.category && (
          <span className="mb-1 text-[11px] font-medium uppercase tracking-wider text-gray-400">
            {product.category.name}
          </span>
        )}
        <Link
          href={`/products/${product.slug}`}
          className="mb-2 line-clamp-2 text-sm font-semibold text-gray-900 transition-colors hover:text-brand-cyan"
        >
          {product.name}
        </Link>

        {product.shortDescription && (
          <p className="mb-3 line-clamp-2 text-xs text-gray-500">{product.shortDescription}</p>
        )}

        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            {hasVariants ? (
              <span className="text-base font-bold text-brand-midnight">
                {formatPriceRange(product, currency)}
              </span>
            ) : (
              <>
                <span className="text-lg font-bold text-brand-midnight">
                  {formatPrice(price, currency)}
                </span>
                {product.compareAtPrice && (
                  <span className="text-xs text-gray-400 line-through">
                    {formatPrice(product.compareAtPrice, currency)}
                  </span>
                )}
              </>
            )}
          </div>

          {hasVariants ? (
            <Link
              href={`/products/${product.slug}`}
              className="flex h-9 items-center gap-1.5 rounded-lg bg-brand-midnight px-3 text-xs font-medium text-white transition-colors hover:bg-brand-cyan"
            >
              Select
            </Link>
          ) : (
            <button
              onClick={() => addItem(product)}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-midnight text-white transition-colors hover:bg-brand-cyan"
              aria-label={`Add ${product.name} to cart`}
            >
              <ShoppingCart size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
