import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { api } from '@/lib/api';
import { ProductDetail } from './ProductDetail';

const BASE_URL = 'https://gadgetparcstore.com';

interface Props {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string) {
  try {
    return await api.products.getBySlug(slug);
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: 'Product Not Found' };

  const title = `${product.name} — Buy Online | GadgetParc`;
  const description =
    product.shortDescription ||
    product.description.replace(/<[^>]*>/g, '').slice(0, 160);
  const image = product.images[0] || '';

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}/products/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/products/${slug}`,
      type: 'website',
      images: image
        ? [
            {
              url: image,
              width: 1200,
              height: 630,
              alt: product.name,
            },
          ]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description,
      images: image ? [image] : [],
    },
  };
}

function buildProductJsonLd(product: NonNullable<Awaited<ReturnType<typeof getProduct>>>) {
  const lowestPrice = product.priceMin;
  const highestPrice = product.priceMax;
  const image = product.images[0] || '';

  const breadcrumbItems = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: BASE_URL,
    },
  ];

  if (product.category) {
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: 2,
      name: product.category.name,
      item: `${BASE_URL}/categories/${product.category.slug}`,
    });
  }

  breadcrumbItems.push({
    '@type': 'ListItem',
    position: breadcrumbItems.length + 1,
    name: product.name,
    item: `${BASE_URL}/products/${product.slug}`,
  });

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Product',
        name: product.name,
        description:
          product.shortDescription ||
          product.description.replace(/<[^>]*>/g, '').slice(0, 500),
        image: product.images,
        url: `${BASE_URL}/products/${product.slug}`,
        brand: { '@type': 'Brand', name: 'GadgetParc' },
        sku: product.slug,
        category: product.category?.name || 'Tech Gear',
        offers:
          lowestPrice === highestPrice
            ? {
                '@type': 'Offer',
                url: `${BASE_URL}/products/${product.slug}`,
                priceCurrency: 'USD',
                price: lowestPrice.toFixed(2),
                availability: product.isActive
                  ? 'https://schema.org/InStock'
                  : 'https://schema.org/OutOfStock',
                seller: { '@type': 'Organization', name: 'GadgetParc' },
                shippingDetails: {
                  '@type': 'OfferShippingDetails',
                  shippingRate: {
                    '@type': 'MonetaryAmount',
                    value: '0',
                    currency: 'USD',
                  },
                  shippingDestination: [
                    {
                      '@type': 'DefinedRegion',
                      addressCountry: 'US',
                    },
                    {
                      '@type': 'DefinedRegion',
                      addressCountry: 'CA',
                    },
                  ],
                  deliveryTime: {
                    '@type': 'ShippingDeliveryTime',
                    handlingTime: {
                      '@type': 'QuantitativeValue',
                      minValue: 1,
                      maxValue: 3,
                      unitCode: 'DAY',
                    },
                    transitTime: {
                      '@type': 'QuantitativeValue',
                      minValue: 7,
                      maxValue: 15,
                      unitCode: 'DAY',
                    },
                  },
                },
                hasMerchantReturnPolicy: {
                  '@type': 'MerchantReturnPolicy',
                  applicableCountry: ['US', 'CA'],
                  returnPolicyCategory:
                    'https://schema.org/MerchantReturnFiniteReturnWindow',
                  merchantReturnDays: 30,
                  returnMethod: 'https://schema.org/ReturnByMail',
                  returnFees: 'https://schema.org/FreeReturn',
                },
              }
            : {
                '@type': 'AggregateOffer',
                url: `${BASE_URL}/products/${product.slug}`,
                priceCurrency: 'USD',
                lowPrice: lowestPrice.toFixed(2),
                highPrice: highestPrice.toFixed(2),
                offerCount: product.variants.length,
                availability: product.isActive
                  ? 'https://schema.org/InStock'
                  : 'https://schema.org/OutOfStock',
              },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbItems,
      },
    ],
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const jsonLd = buildProductJsonLd(product);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetail product={product} />
    </>
  );
}
