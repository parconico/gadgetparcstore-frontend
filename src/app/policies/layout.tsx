import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

const POLICY_LINKS = [
  { label: 'Shipping Policy', href: '/policies/shipping' },
  { label: 'Return & Refund Policy', href: '/policies/refund' },
  { label: 'Terms of Service', href: '/policies/terms' },
  { label: 'Privacy Policy', href: '/policies/privacy' },
];

export default function PoliciesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container-page py-10">
      <nav className="mb-6 flex items-center gap-1 text-sm text-gray-500">
        <Link href="/" className="hover:text-brand-cyan">Home</Link>
        <ChevronRight size={14} />
        <span className="text-gray-900">Policies</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">Legal</h3>
          <ul className="space-y-2">
            {POLICY_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-gray-600 transition-colors hover:text-brand-cyan"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
}
