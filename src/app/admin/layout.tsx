import Link from 'next/link';
import Image from 'next/image';
import { LayoutDashboard, Package, ShoppingCart, Truck } from 'lucide-react';

const NAV = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingCart },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden w-60 shrink-0 border-r border-gray-200 bg-white lg:block">
          <div className="sticky top-0 px-4 py-6">
            <Link href="/admin" className="flex items-center gap-1.5">
              <Image src="/logo.png" alt="GadgetParc" width={32} height={32} className="h-8 w-8 object-contain" />
              <span className="font-sans text-lg font-bold text-brand-midnight">Admin Panel</span>
            </Link>
            <nav className="mt-8 space-y-1">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-brand-midnight"
                >
                  <item.icon size={18} />
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-8 border-t pt-4">
              <Link href="/" className="text-xs text-gray-500 hover:text-brand-cyan">
                &larr; Back to Store
              </Link>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 px-6 py-8 lg:px-10">{children}</main>
      </div>
    </div>
  );
}
