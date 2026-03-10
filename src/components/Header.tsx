'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Menu, X, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { CurrencySelector } from './CurrencySelector';

const NAV_LINKS = [
  { label: 'Home Office', href: '/categories/home-office' },
  { label: 'Smart Lighting', href: '/categories/smart-lighting' },
  { label: 'Keyboards', href: '/categories/mechanical-keyboards' },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const itemCount = useCart((s) => s.getItemCount());

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      {/* Top bar */}
      <div className="bg-brand-midnight text-center text-xs text-white py-2 px-4">
        Free shipping on all US orders &mdash; Upgrade your workspace today
      </div>

      <div className="container-page">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 -ml-2 text-gray-600 hover:text-gray-900"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center">
            <Image
              src="/logo-color.png"
              alt="GadgetParc"
              width={834}
              height={156}
              className="h-9 w-auto"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex flex-1 items-center justify-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-600 transition-colors hover:text-brand-midnight"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <CurrencySelector />
            <Link
              href="/cart"
              className="relative flex items-center gap-1 rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-brand-midnight"
            >
              <ShoppingCart size={22} />
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-cyan text-[10px] font-bold text-white">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="border-t bg-white lg:hidden">
          <nav className="container-page flex flex-col gap-1 py-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
