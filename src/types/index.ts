export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  _count?: { products: number };
}

export interface ProductOption {
  name: string;
  values: string[];
}

export interface Variant {
  id: string;
  title: string;
  priceUSD: number;
  compareAtPrice: number | null;
  availableForSale: boolean;
  selectedOptions: { name: string; value: string }[];
  image: string | null;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string | null;
  priceUSD: number;
  priceEUR: number | null;
  priceGBP: number | null;
  compareAtPrice: number | null;
  images: string[];
  categoryId: string;
  category?: Category;
  supplierId: string | null;
  supplierSKU: string | null;
  supplierCost: number | null;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  tags: string[];
  weight: number | null;
  specifications: Record<string, string> | null;
  createdAt: string;
  variantId: string;
  variants: Variant[];
  options: ProductOption[];
  priceMin: number;
  priceMax: number;
  hasMultipleVariants: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  variantId: string;
  variantTitle: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  currency: string;
  shippingName: string;
  shippingEmail: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string | null;
  shippingZip: string;
  shippingCountry: string;
  payment: Payment | null;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
  total: number;
}

export interface Payment {
  id: string;
  stripePaymentId: string | null;
  amount: number;
  currency: string;
  status: string;
}

export type Currency = 'USD' | 'EUR' | 'GBP';

export interface CurrencyConfig {
  code: Currency;
  symbol: string;
  label: string;
}

export const CURRENCIES: CurrencyConfig[] = [
  { code: 'USD', symbol: '$', label: 'USD' },
  { code: 'EUR', symbol: '€', label: 'EUR' },
  { code: 'GBP', symbol: '£', label: 'GBP' },
];
