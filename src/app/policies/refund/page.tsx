import { Metadata } from 'next';
import { getShopPolicies } from '@/lib/shopify';

export const metadata: Metadata = {
  title: 'Return & Refund Policy | GadgetParc',
  description: 'Learn about GadgetParc return and refund policies.',
};

export default async function RefundPolicyPage() {
  const policies = await getShopPolicies();
  const policy = policies.refundPolicy;

  if (!policy) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-brand-midnight">Return & Refund Policy</h1>
        <p className="mt-4 text-gray-600">Refund policy coming soon.</p>
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
