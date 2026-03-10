import { Metadata } from 'next';
import { getShopPolicies } from '@/lib/shopify';

export const metadata: Metadata = {
  title: 'Shipping Policy | GadgetParc',
  description: 'Learn about GadgetParc shipping methods, delivery times, and tracking.',
};

export default async function ShippingPolicyPage() {
  const policies = await getShopPolicies();
  const policy = policies.shippingPolicy;

  if (!policy) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-brand-midnight">Shipping Policy</h1>
        <p className="mt-4 text-gray-600">Shipping policy coming soon.</p>
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
