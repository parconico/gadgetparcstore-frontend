'use client';

export function NewsletterForm({ variant = 'light' }: { variant?: 'light' | 'dark' }) {
  const isDark = variant === 'dark';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="flex gap-2"
    >
      <input
        type="email"
        placeholder={isDark ? 'Your email' : 'Enter your email'}
        className={`flex-1 rounded-lg border px-4 py-2.5 text-sm focus:outline-none ${
          isDark
            ? 'border-gray-600 bg-gray-800 text-white placeholder:text-gray-500 focus:border-brand-cyan'
            : 'border-gray-600 bg-gray-800 text-white placeholder:text-gray-500 focus:border-brand-cyan'
        }`}
      />
      <button
        type="submit"
        className={isDark
          ? 'rounded-lg bg-brand-cyan px-4 py-2 text-sm font-semibold text-white hover:bg-brand-cyan-hover'
          : 'btn-primary'
        }
      >
        {isDark ? 'Go' : 'Subscribe'}
      </button>
    </form>
  );
}
