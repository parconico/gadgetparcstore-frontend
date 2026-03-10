import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Truck, Shield, Star, Headphones } from 'lucide-react';
import { api } from '@/lib/api';
import { ProductGrid } from '@/components/ProductGrid';
import { NewsletterForm } from '@/components/NewsletterForm';

const CATEGORIES = [
  {
    name: 'Home Office',
    slug: 'home-office',
    description: 'Desks, stands & organizers',
    image: 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=600',
  },
  {
    name: 'Smart Lighting',
    slug: 'smart-lighting',
    description: 'LED strips, lamps & panels',
    image: 'https://images.unsplash.com/photo-1586210579191-33b45e38fa2c?w=600',
  },
  {
    name: 'Mechanical Keyboards',
    slug: 'mechanical-keyboards',
    description: 'Keyboards, keycaps & cables',
    image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600',
  },
];

const TRUST_BADGES = [
  { icon: Truck, title: 'Free Shipping', subtitle: 'On all US orders' },
  { icon: Star, title: '4.8/5 Rating', subtitle: 'From 2,000+ reviews' },
  { icon: Shield, title: 'Secure Payment', subtitle: 'SSL encrypted' },
  { icon: Headphones, title: '24/7 Support', subtitle: 'Always here for you' },
];

async function getFeaturedProducts() {
  try {
    return await api.products.featured();
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const featured = await getFeaturedProducts();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-midnight">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-midnight via-brand-deep to-brand-midnight" />
        <div className="container-page relative z-10 flex flex-col items-center py-20 text-center lg:py-32">
          <span className="mb-4 inline-block rounded-full border border-brand-cyan/30 bg-brand-cyan/10 px-4 py-1 text-xs font-semibold text-brand-cyan">
            Free Shipping on All US Orders
          </span>
          <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Upgrade Your{' '}
            <span className="bg-gradient-to-r from-brand-cyan to-emerald-400 bg-clip-text text-transparent">
              Workspace
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-gray-300">
            Premium tech gear for the modern professional. Smart lighting, mechanical keyboards, and desk accessories curated for productivity.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/categories/home-office" className="btn-primary">
              Shop Now <ArrowRight size={18} />
            </Link>
            <Link href="/categories/mechanical-keyboards" className="btn-secondary !border-white/30 !text-white hover:!bg-white/10">
              View Keyboards
            </Link>
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="border-b border-gray-100 bg-gray-50">
        <div className="container-page grid grid-cols-2 gap-6 py-6 lg:grid-cols-4">
          {TRUST_BADGES.map((badge) => (
            <div key={badge.title} className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-cyan/10 text-brand-cyan">
                <badge.icon size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{badge.title}</p>
                <p className="text-xs text-gray-500">{badge.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="container-page py-16">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-brand-midnight">Shop by Category</h2>
          <p className="mt-2 text-gray-500">Find the perfect gear for your setup</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className="group relative overflow-hidden rounded-2xl"
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-xl font-bold text-white">{cat.name}</h3>
                <p className="mt-1 text-sm text-gray-300">{cat.description}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-cyan">
                  Shop Now <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      {featured.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="container-page">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <h2 className="text-3xl font-bold text-brand-midnight">Best Sellers</h2>
                <p className="mt-2 text-gray-500">Our most popular products this month</p>
              </div>
              <Link
                href="/categories/home-office"
                className="hidden items-center gap-1 text-sm font-semibold text-brand-cyan hover:underline sm:flex"
              >
                View All <ArrowRight size={14} />
              </Link>
            </div>
            <ProductGrid products={featured} />
          </div>
        </section>
      )}

      {/* CTA banner */}
      <section className="bg-brand-deep py-16">
        <div className="container-page text-center">
          <h2 className="text-3xl font-bold text-white">
            Transform Your Desk Into a Productivity Powerhouse
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-gray-300">
            Join thousands of professionals who upgraded their workspace with GadgetParc. Free shipping, 30-day returns, and secure checkout.
          </p>
          <Link href="/categories/smart-lighting" className="btn-primary mt-8">
            Explore Collections <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Newsletter */}
      <section className="container-page py-16">
        <div className="mx-auto max-w-xl rounded-2xl bg-brand-midnight p-8 text-center">
          <h3 className="text-2xl font-bold text-white">Get 10% Off Your First Order</h3>
          <p className="mt-2 text-sm text-gray-400">
            Join our newsletter for exclusive deals and workspace tips.
          </p>
          <div className="mt-5">
            <NewsletterForm variant="light" />
          </div>
        </div>
      </section>
    </>
  );
}
