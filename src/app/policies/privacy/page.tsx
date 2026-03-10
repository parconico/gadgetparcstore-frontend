import { Metadata } from 'next';
import { getShopPolicies } from '@/lib/shopify';

export const metadata: Metadata = {
  title: 'Privacy Policy | GadgetParc',
  description: 'Learn how GadgetParc handles your personal information.',
};

export default async function PrivacyPolicyPage() {
  const policies = await getShopPolicies();
  const policy = policies.privacyPolicy;

  if (!policy) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-brand-midnight">Privacy Policy</h1>
        <p className="mt-4 text-gray-600">Privacy policy coming soon.</p>
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
