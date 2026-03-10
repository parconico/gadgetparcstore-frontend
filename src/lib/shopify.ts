const SHOPIFY_STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || '';
const SHOPIFY_STOREFRONT_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN || '';
const API_VERSION = '2025-01';

const STOREFRONT_URL = `https://${SHOPIFY_STORE_DOMAIN}/api/${API_VERSION}/graphql.json`;

async function shopifyFetch<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const res = await fetch(STOREFRONT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 },
  });

  const json = await res.json();

  if (json.errors) {
    console.error('Shopify API errors:', JSON.stringify(json.errors));
    throw new Error(json.errors[0]?.message || 'Shopify API error');
  }

  return json.data;
}

// --- GraphQL Fragments ---

const PRODUCT_FRAGMENT = `
  fragment ProductFields on Product {
    id
    title
    handle
    description
    descriptionHtml
    tags
    productType
    createdAt
    options {
      id
      name
      values
    }
    images(first: 10) {
      edges {
        node {
          url
          altText
        }
      }
    }
    variants(first: 250) {
      edges {
        node {
          id
          title
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
          availableForSale
          selectedOptions {
            name
            value
          }
          image {
            url
            altText
          }
        }
      }
    }
    collections(first: 3) {
      edges {
        node {
          id
          title
          handle
        }
      }
    }
  }
`;

const COLLECTION_FRAGMENT = `
  fragment CollectionFields on Collection {
    id
    title
    handle
    description
    image {
      url
      altText
    }
  }
`;

// --- Product Queries ---

export async function getProducts(params?: {
  first?: number;
  query?: string;
  sortKey?: string;
  reverse?: boolean;
}) {
  const { first = 20, query = '', sortKey = 'BEST_SELLING', reverse = false } = params || {};

  const data = await shopifyFetch<{
    products: { edges: { node: ShopifyProduct }[]; pageInfo: { hasNextPage: boolean } };
  }>(`
    ${PRODUCT_FRAGMENT}
    query GetProducts($first: Int!, $query: String, $sortKey: ProductSortKeys, $reverse: Boolean) {
      products(first: $first, query: $query, sortKey: $sortKey, reverse: $reverse) {
        edges {
          node {
            ...ProductFields
          }
        }
        pageInfo {
          hasNextPage
        }
      }
    }
  `, { first, query: query || undefined, sortKey, reverse });

  return data.products.edges.map((edge) => edge.node);
}

export async function getProductByHandle(handle: string) {
  const data = await shopifyFetch<{ productByHandle: ShopifyProduct | null }>(`
    ${PRODUCT_FRAGMENT}
    query GetProductByHandle($handle: String!) {
      productByHandle(handle: $handle) {
        ...ProductFields
      }
    }
  `, { handle });

  return data.productByHandle;
}

export async function getFeaturedProducts(count = 8) {
  return getProducts({ first: count, sortKey: 'BEST_SELLING' });
}

// --- Collection Queries ---

export async function getCollections() {
  const data = await shopifyFetch<{
    collections: { edges: { node: ShopifyCollection }[] };
  }>(`
    ${COLLECTION_FRAGMENT}
    query GetCollections {
      collections(first: 20) {
        edges {
          node {
            ...CollectionFields
            products(first: 0) {
              filters {
                id
              }
            }
          }
        }
      }
    }
  `);

  return data.collections.edges.map((edge) => edge.node);
}

export async function getCollectionByHandle(handle: string) {
  const data = await shopifyFetch<{ collectionByHandle: ShopifyCollectionWithProducts | null }>(`
    ${COLLECTION_FRAGMENT}
    ${PRODUCT_FRAGMENT}
    query GetCollectionByHandle($handle: String!) {
      collectionByHandle(handle: $handle) {
        ...CollectionFields
        products(first: 50, sortKey: BEST_SELLING) {
          edges {
            node {
              ...ProductFields
            }
          }
        }
      }
    }
  `, { handle });

  return data.collectionByHandle;
}

// --- Cart / Checkout ---

export async function createCart(lines: { variantId: string; quantity: number }[]) {
  const data = await shopifyFetch<{ cartCreate: { cart: ShopifyCart; userErrors: { message: string }[] } }>(`
    mutation CartCreate($lines: [CartLineInput!]!) {
      cartCreate(input: { lines: $lines }) {
        cart {
          id
          checkoutUrl
          totalQuantity
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
        }
        userErrors {
          message
        }
      }
    }
  `, {
    lines: lines.map((l) => ({
      merchandiseId: l.variantId,
      quantity: l.quantity,
    })),
  });

  if (data.cartCreate.userErrors.length > 0) {
    throw new Error(data.cartCreate.userErrors[0].message);
  }

  return data.cartCreate.cart;
}

// --- Type Definitions (Shopify raw types) ---

export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml: string;
  tags: string[];
  productType: string;
  createdAt: string;
  options: { id: string; name: string; values: string[] }[];
  images: {
    edges: { node: { url: string; altText: string | null } }[];
  };
  variants: {
    edges: {
      node: {
        id: string;
        title: string;
        price: { amount: string; currencyCode: string };
        compareAtPrice: { amount: string; currencyCode: string } | null;
        availableForSale: boolean;
        selectedOptions: { name: string; value: string }[];
        image: { url: string; altText: string | null } | null;
      };
    }[];
  };
  collections: {
    edges: { node: { id: string; title: string; handle: string } }[];
  };
}

export interface ShopifyCollection {
  id: string;
  title: string;
  handle: string;
  description: string;
  image: { url: string; altText: string | null } | null;
}

export interface ShopifyCollectionWithProducts extends ShopifyCollection {
  products: {
    edges: { node: ShopifyProduct }[];
  };
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    totalAmount: {
      amount: string;
      currencyCode: string;
    };
  };
}
