import Link from 'next/link';
import { ArrowRight, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-cyan/10">
        <Search size={32} className="text-brand-cyan" />
      </div>
      <h1 className="mt-6 text-4xl font-bold text-brand-midnight">Page Not Found</h1>
      <p className="mt-3 max-w-md text-gray-500">
        Sorry, we couldn&apos;t find the page you&apos;re looking for. It may have been moved or
        no longer exists.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link href="/" className="btn-primary">
          Back to Home <ArrowRight size={18} />
        </Link>
        <Link href="/categories/home-office" className="btn-secondary">
          Browse Products <ArrowRight size={18} />
        </Link>
      </div>
      <div className="mt-12 grid gap-4 sm:grid-cols-3">
        {[
          { name: 'Home Office', slug: 'home-office' },
          { name: 'Smart Lighting', slug: 'smart-lighting' },
          { name: 'Mechanical Keyboards', slug: 'mechanical-keyboards' },
        ].map((cat) => (
          <Link
            key={cat.slug}
            href={`/categories/${cat.slug}`}
            className="rounded-xl border border-gray-200 px-6 py-4 text-sm font-medium text-gray-700 transition-colors hover:border-brand-cyan hover:text-brand-cyan"
          >
            {cat.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
