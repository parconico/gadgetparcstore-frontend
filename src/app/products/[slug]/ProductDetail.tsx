'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useMemo, useCallback, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import {
  ShoppingCart,
  Zap,
  Truck,
  RotateCcw,
  Shield,
  Minus,
  Plus,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/hooks/useCart';
import {
  getPrice,
  formatPrice,
  getCompareAtPrice,
  getDiscount,
  getVariantPrice,
  getVariantCompareAtPrice,
  getVariantDiscount,
  formatPriceRange,
} from '@/lib/currency';
import {
  VariantSelector,
  findVariantByOptions,
  getDefaultOptions,
} from '@/components/VariantSelector';

function cleanDescription(html: string): string {
  let cleaned = html;
  // Remove ALL images — product photos are already in the carousel
  cleaned = cleaned.replace(/<img[^>]*\/?>/gi, '');
  // Remove empty links that wrapped images
  cleaned = cleaned.replace(/<a[^>]*>\s*<\/a>/gi, '');
  // Remove empty paragraphs, divs, spans left behind
  cleaned = cleaned.replace(/<(p|div|span|figure|picture)[^>]*>\s*<\/(p|div|span|figure|picture)>/gi, '');
  // Remove "SPECIFICATIONS" header text
  cleaned = cleaned.replace(/SPECIFICATIONS?\s*:?/gi, '');
  // Remove iframes (some sellers embed videos)
  cleaned = cleaned.replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, '');
  // Clean up multiple consecutive line breaks
  cleaned = cleaned.replace(/(<br\s*\/?\s*>){3,}/gi, '<br><br>');
  return cleaned;
}

export function ProductDetail({ product }: { product: Product }) {
  const { addItem, currency } = useCart();
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'shipping'>('description');
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(
    () => getDefaultOptions(product),
  );

  const selectedVariant = useMemo(
    () => findVariantByOptions(product, selectedOptions),
    [product, selectedOptions],
  );

  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [optionName]: value }));
  };

  const displayPrice = selectedVariant
    ? getVariantPrice(selectedVariant, currency)
    : getPrice(product, currency);
  const displayCompareAt = selectedVariant
    ? getVariantCompareAtPrice(selectedVariant, currency)
    : getCompareAtPrice(product, currency);
  const displayDiscount = selectedVariant
    ? getVariantDiscount(selectedVariant)
    : getDiscount(product);

  const variantImageUrl = selectedVariant?.image;
  const allImages = product.images;
  const variantImageIndex = variantImageUrl
    ? allImages.indexOf(variantImageUrl)
    : -1;

  const canAddToCart = !product.hasMultipleVariants ||
    (selectedVariant !== null && selectedVariant.availableForSale);

  const handleAddToCart = () => {
    if (!canAddToCart) return;
    const vid = selectedVariant?.id || product.variantId;
    const vtitle = selectedVariant?.title || 'Default';
    addItem(product, qty, vid, vtitle);
    setQty(1);
  };

  const displayImages = variantImageUrl && variantImageIndex === -1
    ? [variantImageUrl, ...allImages]
    : allImages;

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi],
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    return () => { emblaApi.off('select', onSelect); };
  }, [emblaApi, onSelect]);

  // Sync carousel when variant changes
  useEffect(() => {
    if (!emblaApi) return;
    const targetIndex = variantImageUrl
      ? (variantImageIndex >= 0 ? variantImageIndex : 0)
      : 0;
    emblaApi.scrollTo(targetIndex, true);
  }, [emblaApi, variantImageUrl, variantImageIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') scrollPrev();
      if (e.key === 'ArrowRight') scrollNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [scrollPrev, scrollNext]);

  return (
    <div className="container-page py-4 lg:py-8">
      {/* Breadcrumb */}
      <nav className="mb-4 flex items-center gap-1 overflow-hidden text-sm text-gray-500 lg:mb-6">
        <Link href="/" className="shrink-0 hover:text-brand-cyan">Home</Link>
        <ChevronRight size={14} className="shrink-0" />
        {product.category && (
          <>
            <Link href={`/categories/${product.category.slug}`} className="shrink-0 hover:text-brand-cyan">
              {product.category.name}
            </Link>
            <ChevronRight size={14} className="shrink-0" />
          </>
        )}
        <span className="truncate text-gray-900">{product.name}</span>
      </nav>

      <div className="grid gap-6 lg:grid-cols-2 lg:gap-10">
        {/* Image carousel */}
        <div className="space-y-3">
          <div className="group/carousel relative overflow-hidden rounded-xl bg-gray-50 lg:rounded-2xl">
            <div ref={emblaRef} className="overflow-hidden">
              <div className="flex touch-pan-y">
                {displayImages.map((img, i) => (
                  <div key={i} className="relative aspect-square min-w-0 flex-[0_0_100%]">
                    <Image
                      src={img}
                      alt={`${product.name} - ${i + 1}`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                      priority={i === 0}
                    />
                  </div>
                ))}
              </div>
            </div>

            {displayDiscount && (
              <span className="absolute left-4 top-4 z-10 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">
                -{displayDiscount}% OFF
              </span>
            )}

            {displayImages.length > 1 && (
              <>
                <button
                  onClick={scrollPrev}
                  className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md backdrop-blur-sm transition-opacity hover:bg-white md:opacity-0 md:group-hover/carousel:opacity-100"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={scrollNext}
                  className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md backdrop-blur-sm transition-opacity hover:bg-white md:opacity-0 md:group-hover/carousel:opacity-100"
                  aria-label="Next image"
                >
                  <ChevronRight size={20} />
                </button>

                <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5 rounded-full bg-black/20 px-3 py-1.5 backdrop-blur-sm">
                  {displayImages.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => scrollTo(i)}
                      className={`h-2 rounded-full transition-all ${
                        i === selectedIndex ? 'w-5 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'
                      }`}
                      aria-label={`Go to image ${i + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {displayImages.length > 1 && (
            <div className="hidden gap-3 overflow-x-auto pb-2 sm:flex">
              {displayImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => scrollTo(i)}
                  className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors lg:h-20 lg:w-20 ${
                    i === selectedIndex ? 'border-brand-cyan' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Image src={img} alt="" fill sizes="(max-width: 1024px) 64px, 80px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product info */}
        <div>
          {product.category && (
            <span className="mb-2 inline-block text-xs font-semibold uppercase tracking-wider text-brand-cyan">
              {product.category.name}
            </span>
          )}
          <h1 className="text-lg font-bold leading-tight text-brand-midnight sm:text-2xl lg:text-3xl">{product.name}</h1>

          {/* Price */}
          <div className="mt-3 flex items-baseline gap-3 sm:mt-4">
            {product.hasMultipleVariants && !selectedVariant ? (
              <span className="text-3xl font-bold text-brand-midnight">
                {formatPriceRange(product, currency)}
              </span>
            ) : (
              <>
                <span className="text-3xl font-bold text-brand-midnight">
                  {formatPrice(displayPrice, currency)}
                </span>
                {displayCompareAt && (
                  <span className="text-lg text-gray-400 line-through">
                    {formatPrice(displayCompareAt, currency)}
                  </span>
                )}
                {displayDiscount && (
                  <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-600">
                    Save {displayDiscount}%
                  </span>
                )}
              </>
            )}
          </div>

          

          {/* Variant Selector */}
          {product.hasMultipleVariants && (
            <div className="mt-6">
              <VariantSelector
                product={product}
                selectedOptions={selectedOptions}
                onOptionChange={handleOptionChange}
                selectedVariant={selectedVariant}
              />
            </div>
          )}

          {/* Quantity + ATC */}
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">Quantity:</span>
              <div className="flex items-center rounded-lg border border-gray-200">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="px-3 py-2 text-gray-500 hover:text-gray-900"
                >
                  <Minus size={16} />
                </button>
                <span className="w-10 text-center text-sm font-semibold">{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="px-3 py-2 text-gray-500 hover:text-gray-900"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!canAddToCart}
              className="btn-primary w-full text-base disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ShoppingCart size={20} />
              {!canAddToCart ? 'Select options' : 'Add to Cart'}
            </button>
            <Link
              href={canAddToCart ? '/cart' : '#'}
              onClick={(e) => {
                if (!canAddToCart) {
                  e.preventDefault();
                  return;
                }
                handleAddToCart();
              }}
              className={`btn-secondary w-full text-base ${!canAddToCart ? 'pointer-events-none opacity-50' : ''}`}
            >
              <Zap size={20} /> Buy It Now
            </Link>
          </div>

          {/* Trust badges */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            {[
              { icon: Truck, text: 'Free Shipping' },
              { icon: RotateCcw, text: '30-Day Returns' },
              { icon: Shield, text: 'Secure Checkout' },
              { icon: Zap, text: 'Processed in 1-3 Days' },
            ].map((badge) => (
              <div key={badge.text} className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2">
                <badge.icon size={16} className="text-brand-cyan" />
                <span className="text-xs font-medium text-gray-700">{badge.text}</span>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="mt-6 border-t pt-4 lg:mt-8 lg:pt-6">
            <div className="flex gap-4 overflow-x-auto border-b sm:gap-6">
              {(['description', 'specs', 'shipping'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`border-b-2 pb-3 text-sm font-semibold capitalize transition-colors ${
                    activeTab === tab
                      ? 'border-brand-cyan text-brand-cyan'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab === 'specs' ? 'Specifications' : tab}
                </button>
              ))}
            </div>
            <div className="pt-4 text-sm leading-relaxed text-gray-600">
              {activeTab === 'description' && (
                <div
                  className="prose prose-sm max-w-none overflow-hidden [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-lg"
                  dangerouslySetInnerHTML={{ __html: cleanDescription(product.description) }}
                />
              )}
              {activeTab === 'specs' && product.specifications && (
                <table className="w-full">
                  <tbody>
                    {Object.entries(product.specifications).map(([key, val]) => (
                      <tr key={key} className="border-b border-gray-100">
                        <td className="py-2 pr-4 font-medium capitalize text-gray-900">{key}</td>
                        <td className="py-2 text-gray-600">{val as string}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {activeTab === 'shipping' && (
                <div className="space-y-4">
                  <div className="rounded-lg bg-green-50 px-4 py-3">
                    <p className="font-semibold text-green-800">Free Shipping on All Orders</p>
                    <p className="mt-1 text-sm text-green-700">We offer free standard shipping to the United States and Canada.</p>
                  </div>
                  <div className="space-y-2">
                    <p><strong>United States:</strong> 7–15 business days</p>
                    <p><strong>Canada:</strong> 10–20 business days</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-500">
                    <p>Orders are processed within 1–3 business days. You will receive a tracking number via email once your order ships.</p>
                    <p className="mt-2">
                      For more details, see our{' '}
                      <a href="/policies/shipping" className="text-brand-cyan hover:underline">Shipping Policy</a>.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
