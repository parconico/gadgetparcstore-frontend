import {
  getProducts,
  getProductByHandle,
  getFeaturedProducts,
  getCollections,
  getCollectionByHandle,
  createCart,
  type ShopifyProduct,
  type ShopifyCollection,
} from './shopify';
import type { Product, Category } from '@/types';

// --- Mappers: Shopify → our types ---

function mapProduct(sp: ShopifyProduct): Product {
  const firstVariant = sp.variants.edges[0]?.node;
  const collection = sp.collections.edges[0]?.node;
  const price = parseFloat(firstVariant?.price.amount || '0');
  const compareAt = firstVariant?.compareAtPrice
    ? parseFloat(firstVariant.compareAtPrice.amount)
    : null;

  const variants: import('@/types').Variant[] = sp.variants.edges.map((e) => {
    const v = e.node;
    return {
      id: v.id,
      title: v.title,
      priceUSD: parseFloat(v.price.amount),
      compareAtPrice: v.compareAtPrice ? parseFloat(v.compareAtPrice.amount) : null,
      availableForSale: v.availableForSale,
      selectedOptions: v.selectedOptions,
      image: v.image?.url || null,
    };
  });

  const prices = variants.map((v) => v.priceUSD);
  const priceMin = prices.length > 0 ? Math.min(...prices) : price;
  const priceMax = prices.length > 0 ? Math.max(...prices) : price;

  const options: import('@/types').ProductOption[] = (sp.options || [])
    .filter((o) => !(o.values.length === 1 && o.values[0] === 'Default Title'))
    .map((o) => ({ name: o.name, values: o.values }));

  return {
    id: sp.id,
    name: sp.title,
    slug: sp.handle,
    description: sp.descriptionHtml || sp.description,
    shortDescription: sp.description.slice(0, 160) || null,
    priceUSD: price,
    priceEUR: null,
    priceGBP: null,
    compareAtPrice: compareAt,
    images: sp.images.edges.map((e) => e.node.url),
    categoryId: collection?.id || '',
    category: collection
      ? { id: collection.id, name: collection.title, slug: collection.handle, description: null, image: null }
      : undefined,
    supplierId: null,
    supplierSKU: null,
    supplierCost: null,
    stock: 999,
    isActive: firstVariant?.availableForSale ?? true,
    isFeatured: false,
    tags: sp.tags,
    weight: null,
    specifications: null,
    createdAt: sp.createdAt,
    variantId: firstVariant?.id || '',
    variants,
    options,
    priceMin,
    priceMax,
    hasMultipleVariants: variants.length > 1 && options.length > 0,
  };
}

function mapCollection(sc: ShopifyCollection): Category {
  return {
    id: sc.id,
    name: sc.title,
    slug: sc.handle,
    description: sc.description || null,
    image: sc.image?.url || null,
  };
}

// --- Public API (same interface your components already use) ---

export const api = {
  products: {
    list: async (params?: Record<string, string>) => {
      const categorySlug = params?.category;
      if (categorySlug) {
        const collection = await getCollectionByHandle(categorySlug);
        if (!collection) return { products: [], total: 0 };
        const products = collection.products.edges.map((e) => mapProduct(e.node));
        return { products, total: products.length };
      }

      const query = params?.search || '';
      const shopifyProducts = await getProducts({ query, first: 50 });
      const products = shopifyProducts.map(mapProduct);
      return { products, total: products.length };
    },

    featured: async () => {
      const shopifyProducts = await getFeaturedProducts(8);
      return shopifyProducts.map(mapProduct);
    },

    featuredMixed: async (perCategory = 3) => {
      const slugs = ['home-office', 'smart-lighting', 'mechanical-keyboards'];
      const results = await Promise.all(
        slugs.map((slug) => getCollectionByHandle(slug)),
      );
      const mixed: Product[] = [];
      for (const collection of results) {
        if (!collection) continue;
        const products = collection.products.edges
          .slice(0, perCategory)
          .map((e) => mapProduct(e.node));
        mixed.push(...products);
      }
      return mixed;
    },

    getBySlug: async (slug: string) => {
      const sp = await getProductByHandle(slug);
      if (!sp) return null;
      return mapProduct(sp);
    },

    categories: async () => {
      const collections = await getCollections();
      return collections.map(mapCollection);
    },

    categoryBySlug: async (slug: string) => {
      const collection = await getCollectionByHandle(slug);
      if (!collection) return null;
      return mapCollection(collection);
    },
  },

  checkout: {
    create: async (lines: { variantId: string; quantity: number }[]) => {
      const cart = await createCart(lines);
      return { checkoutUrl: cart.checkoutUrl };
    },
  },

  // Keep admin stubs for compatibility — these hit the NestJS backend if still running
  orders: {
    create: async (_data: any) => {
      throw new Error('Orders are now handled by Shopify Checkout');
    },
  },

  payments: {
    createCheckout: async (_orderId: string) => {
      throw new Error('Payments are now handled by Shopify Checkout');
    },
  },

  admin: {
    dashboard: async () => ({
      totalOrders: 0,
      totalRevenue: 0,
      totalProducts: 0,
      recentOrders: [] as any[],
      ordersByStatus: [] as { status: string; _count: number }[],
    }),
    products: async () => {
      const data = await api.products.list();
      return data;
    },
    orders: async () => ({ orders: [], total: 0 }),
    updateOrderStatus: async (_id: string, status: string) => ({ status }),
  },
};
