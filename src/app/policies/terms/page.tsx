import { Metadata } from 'next';
import { getShopPolicies } from '@/lib/shopify';

export const metadata: Metadata = {
  title: 'Terms of Service | GadgetParc',
  description: 'GadgetParc terms of service and conditions of use.',
};

export default async function TermsPage() {
  const policies = await getShopPolicies();
  const policy = policies.termsOfService;

  if (!policy) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-brand-midnight">Terms of Service</h1>
        <p className="mt-4 text-gray-600">Terms of service coming soon.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-brand-midnight">{policy.title}</h1>
      <div
        className="prose prose-sm mt-6 max-w-none text-gray-600 prose-headings:text-brand-midnight prose-strong:text-gray-900"
        dangerouslySetInnerHTML={{ __html: policy.body }}
      />
    </div>
  );
}
