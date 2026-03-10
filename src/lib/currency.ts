import { Currency, Product, Variant } from '@/types';

const CURRENCY_FACTOR: Record<Currency, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
};

function convertPrice(usd: number, currency: Currency): number {
  return usd * CURRENCY_FACTOR[currency];
}

export function getPrice(product: Product, currency: Currency): number {
  switch (currency) {
    case 'EUR':
      return product.priceEUR ?? product.priceUSD * CURRENCY_FACTOR.EUR;
    case 'GBP':
      return product.priceGBP ?? product.priceUSD * CURRENCY_FACTOR.GBP;
    default:
      return product.priceUSD;
  }
}

export function getVariantPrice(variant: Variant, currency: Currency): number {
  return convertPrice(variant.priceUSD, currency);
}

export function getPriceRange(product: Product, currency: Currency): { min: number; max: number } {
  return {
    min: convertPrice(product.priceMin, currency),
    max: convertPrice(product.priceMax, currency),
  };
}

export function formatPrice(amount: number, currency: Currency): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatPriceRange(product: Product, currency: Currency): string {
  const range = getPriceRange(product, currency);
  if (Math.abs(range.min - range.max) < 0.01) {
    return formatPrice(range.min, currency);
  }
  return `${formatPrice(range.min, currency)} – ${formatPrice(range.max, currency)}`;
}

export function getCompareAtPrice(
  product: Product,
  currency: Currency,
): number | null {
  if (!product.compareAtPrice) return null;
  return convertPrice(product.compareAtPrice, currency);
}

export function getVariantCompareAtPrice(
  variant: Variant,
  currency: Currency,
): number | null {
  if (!variant.compareAtPrice) return null;
  return convertPrice(variant.compareAtPrice, currency);
}

export function getDiscount(product: Product): number | null {
  if (!product.compareAtPrice) return null;
  return Math.round(
    ((product.compareAtPrice - product.priceUSD) / product.compareAtPrice) * 100,
  );
}

export function getVariantDiscount(variant: Variant): number | null {
  if (!variant.compareAtPrice) return null;
  return Math.round(
    ((variant.compareAtPrice - variant.priceUSD) / variant.compareAtPrice) * 100,
  );
}
