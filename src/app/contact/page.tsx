import { Metadata } from 'next';
import Link from 'next/link';
import { Mail, Clock, MessageCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us | GadgetParc',
  description: 'Get in touch with GadgetParc support team.',
};

export default function ContactPage() {
  return (
    <div className="container-page py-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold text-brand-midnight">Contact Us</h1>
        <p className="mt-4 text-gray-600">
          Have a question about your order, a product, or anything else? We&apos;re here to help.
        </p>

        <div className="mt-8 space-y-6">
          <div className="flex items-start gap-4 rounded-xl border border-gray-200 p-6">
            <div className="rounded-lg bg-brand-cyan/10 p-3">
              <Mail className="h-6 w-6 text-brand-cyan" />
            </div>
            <div>
              <h3 className="font-semibold text-brand-midnight">Email Support</h3>
              <p className="mt-1 text-sm text-gray-600">
                Send us an email and we&apos;ll get back to you within 24-48 hours.
              </p>
              <a
                href="mailto:gadgetparcstore@gmail.com"
                className="mt-2 inline-block text-sm font-medium text-brand-cyan hover:underline"
              >
                gadgetparcstore@gmail.com
              </a>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-xl border border-gray-200 p-6">
            <div className="rounded-lg bg-brand-cyan/10 p-3">
              <Clock className="h-6 w-6 text-brand-cyan" />
            </div>
            <div>
              <h3 className="font-semibold text-brand-midnight">Business Hours</h3>
              <p className="mt-1 text-sm text-gray-600">
                Monday — Friday: 9:00 AM — 6:00 PM (EST)<br />
                Saturday — Sunday: Closed
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-xl border border-gray-200 p-6">
            <div className="rounded-lg bg-brand-cyan/10 p-3">
              <MessageCircle className="h-6 w-6 text-brand-cyan" />
            </div>
            <div>
              <h3 className="font-semibold text-brand-midnight">Common Topics</h3>
              <ul className="mt-2 space-y-1 text-sm text-gray-600">
                <li>
                  <strong>Order tracking:</strong> Include your order number in the email subject line.
                </li>
                <li>
                  <strong>Returns:</strong> See our{' '}
                  <Link href="/policies/refund" className="text-brand-cyan hover:underline">
                    Return Policy
                  </Link>
                </li>
                <li>
                  <strong>Shipping:</strong> See our{' '}
                  <Link href="/policies/shipping" className="text-brand-cyan hover:underline">
                    Shipping Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
