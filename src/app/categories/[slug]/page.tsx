import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { api } from '@/lib/api';
import { ProductGrid } from '@/components/ProductGrid';

const BASE_URL = 'https://gadgetparcstore.com';

interface Props {
  params: Promise<{ slug: string }>;
}

async function getData(slug: string) {
  try {
    const [category, data] = await Promise.all([
      api.products.categoryBySlug(slug),
      api.products.list({ category: slug }),
    ]);
    return { category, products: data.products, total: data.total };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getData(slug);
  if (!data?.category) return { title: 'Category Not Found' };

  const title = `${data.category.name} — Shop Online | GadgetParc`;
  const description =
    data.category.description ||
    `Shop the best ${data.category.name} at GadgetParc. Free shipping to the US & Canada. 30-day hassle-free returns.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}/categories/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/categories/${slug}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

function buildCategoryJsonLd(
  categoryName: string,
  slug: string,
  products: { name: string; slug: string; images: string[]; priceUSD: number }[],
) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        name: categoryName,
        url: `${BASE_URL}/categories/${slug}`,
        description: `Shop ${categoryName} at GadgetParc. Free shipping US & Canada.`,
        isPartOf: {
          '@type': 'WebSite',
          url: BASE_URL,
          name: 'GadgetParc',
        },
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: products.length,
          itemListElement: products.slice(0, 20).map((p, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            url: `${BASE_URL}/products/${p.slug}`,
            name: p.name,
            image: p.images[0] || '',
          })),
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: BASE_URL,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: categoryName,
            item: `${BASE_URL}/categories/${slug}`,
          },
        ],
      },
    ],
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const data = await getData(slug);
  if (!data?.category) notFound();

  const { category, products, total } = data;
  const jsonLd = buildCategoryJsonLd(category.name, slug, products);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container-page py-8">
        <nav className="mb-6 flex items-center gap-1 text-sm text-gray-500" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-brand-cyan">Home</Link>
          <ChevronRight size={14} />
          <span className="text-gray-900">{category.name}</span>
        </nav>

        <div className="mb-10">
          <h1 className="text-3xl font-bold text-brand-midnight">{category.name}</h1>
          {category.description && (
            <p className="mt-2 max-w-2xl text-gray-500">{category.description}</p>
          )}
          <p className="mt-1 text-sm text-gray-400">{total} products</p>
        </div>

        {products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <div className="py-20 text-center">
            <p className="text-lg text-gray-500">No products found in this category yet.</p>
            <Link href="/" className="btn-primary mt-4">
              Back to Home
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
