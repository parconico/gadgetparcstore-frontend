'use client';

import { Product, Variant, ProductOption } from '@/types';

interface VariantSelectorProps {
  product: Product;
  selectedOptions: Record<string, string>;
  onOptionChange: (optionName: string, value: string) => void;
  selectedVariant: Variant | null;
}

export function VariantSelector({
  product,
  selectedOptions,
  onOptionChange,
  selectedVariant,
}: VariantSelectorProps) {
  if (!product.hasMultipleVariants) return null;

  function isOptionAvailable(optionName: string, value: string): boolean {
    const testOptions = { ...selectedOptions, [optionName]: value };
    return product.variants.some((v) => {
      return v.selectedOptions.every(
        (so) => testOptions[so.name] === undefined || testOptions[so.name] === so.value,
      ) && v.availableForSale;
    });
  }

  return (
    <div className="space-y-4">
      {product.options.map((option: ProductOption) => (
        <div key={option.name}>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            {option.name}
            {selectedOptions[option.name] && (
              <span className="ml-2 font-normal text-gray-500">
                : {selectedOptions[option.name]}
              </span>
            )}
          </label>
          <div className="flex flex-wrap gap-2">
            {option.values.map((value) => {
              const isSelected = selectedOptions[option.name] === value;
              const available = isOptionAvailable(option.name, value);

              return (
                <button
                  key={value}
                  onClick={() => onOptionChange(option.name, value)}
                  disabled={!available}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all sm:px-4 sm:py-2 sm:text-sm ${
                    isSelected
                      ? 'border-brand-cyan bg-brand-cyan/10 text-brand-cyan ring-1 ring-brand-cyan'
                      : available
                        ? 'border-gray-200 text-gray-700 hover:border-gray-400'
                        : 'cursor-not-allowed border-gray-100 text-gray-300 line-through'
                  }`}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {selectedVariant && !selectedVariant.availableForSale && (
        <p className="text-sm font-medium text-red-500">
          This combination is currently out of stock.
        </p>
      )}
    </div>
  );
}

/**
 * Finds the variant matching the selected options.
 * Returns null if no exact match found.
 */
export function findVariantByOptions(
  product: Product,
  selectedOptions: Record<string, string>,
): Variant | null {
  const optionCount = product.options.length;
  const selectedCount = Object.keys(selectedOptions).length;
  if (selectedCount < optionCount) return null;

  return (
    product.variants.find((v) =>
      v.selectedOptions.every((so) => selectedOptions[so.name] === so.value),
    ) || null
  );
}

/**
 * Returns default selected options (first available variant's options).
 */
export function getDefaultOptions(product: Product): Record<string, string> {
  if (!product.hasMultipleVariants) return {};
  const firstAvailable = product.variants.find((v) => v.availableForSale) || product.variants[0];
  if (!firstAvailable) return {};
  const opts: Record<string, string> = {};
  firstAvailable.selectedOptions.forEach((so) => {
    opts[so.name] = so.value;
  });
  return opts;
}
