import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { api } from '@/lib/api';
import { ProductGrid } from '@/components/ProductGrid';

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

  return {
    title: data.category.name,
    description: data.category.description || `Shop ${data.category.name} at GadgetParc`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const data = await getData(slug);
  if (!data?.category) notFound();

  const { category, products, total } = data;

  return (
    <div className="container-page py-8">
      <nav className="mb-6 flex items-center gap-1 text-sm text-gray-500">
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
  );
}
