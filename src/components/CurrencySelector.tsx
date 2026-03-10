'use client';

import { useCart } from '@/hooks/useCart';
import { CURRENCIES, Currency } from '@/types';

export function CurrencySelector() {
  const currency = useCart((s) => s.currency);
  const setCurrency = useCart((s) => s.setCurrency);

  return (
    <select
      value={currency}
      onChange={(e) => setCurrency(e.target.value as Currency)}
      className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs font-medium text-gray-700 focus:border-brand-cyan focus:outline-none focus:ring-1 focus:ring-brand-cyan"
    >
      {CURRENCIES.map((c) => (
        <option key={c.code} value={c.code}>
          {c.symbol} {c.label}
        </option>
      ))}
    </select>
  );
}
