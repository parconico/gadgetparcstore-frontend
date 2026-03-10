import Link from 'next/link';
import Image from 'next/image';
import { NewsletterForm } from './NewsletterForm';

const SHOP_LINKS = [
  { label: 'Home Office', href: '/categories/home-office' },
  { label: 'Smart Lighting', href: '/categories/smart-lighting' },
  { label: 'Mechanical Keyboards', href: '/categories/mechanical-keyboards' },
];

const SUPPORT_LINKS = [
  { label: 'Contact Us', href: '/contact' },
  { label: 'Shipping Policy', href: '/policies/shipping' },
  { label: 'Return Policy', href: '/policies/refund' },
  { label: 'Terms of Service', href: '/policies/terms' },
  { label: 'Privacy Policy', href: '/policies/privacy' },
];

export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-brand-midnight text-gray-300">
      <div className="container-page py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo-color.png"
                alt="GadgetParc"
                width={834}
                height={156}
                className="h-8 w-auto brightness-0 invert"
              />
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-gray-400">
              Premium tech gear for the modern professional. Upgrade your workspace with curated gadgets.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="mb-3 font-sans text-sm font-semibold uppercase tracking-wider text-white">Shop</h4>
            <ul className="space-y-2">
              {SHOP_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 transition-colors hover:text-brand-cyan">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="mb-3 font-sans text-sm font-semibold uppercase tracking-wider text-white">Support</h4>
            <ul className="space-y-2">
              {SUPPORT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 transition-colors hover:text-brand-cyan">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="mb-3 font-sans text-sm font-semibold uppercase tracking-wider text-white">Get 10% Off</h4>
            <p className="text-sm text-gray-400">Join our newsletter for exclusive deals and workspace tips.</p>
            <div className="mt-3">
              <NewsletterForm variant="dark" />
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-gray-700 pt-6 text-xs text-gray-500 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} GadgetParc. All rights reserved.</p>
          <div className="flex gap-4">
            <span>PayPal</span>
            <span>Visa</span>
            <span>Mastercard</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
