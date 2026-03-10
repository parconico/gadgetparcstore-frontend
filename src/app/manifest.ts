import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'GadgetParc — Premium Tech Gear',
    short_name: 'GadgetParc',
    description:
      'Premium tech gear for the modern professional. Home office gadgets, smart lighting, and mechanical keyboards with free shipping to the US & Canada.',
    start_url: '/',
    id: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    background_color: '#ffffff',
    theme_color: '#1A1A2E',
    categories: ['shopping', 'lifestyle'],
    lang: 'en-US',
    dir: 'ltr',
    icons: [
      {
        src: '/api/pwa-icon?size=192',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/api/pwa-icon?size=512',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/api/pwa-icon?size=192',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/api/pwa-icon?size=512',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    screenshots: [
      {
        src: '/api/pwa-icon?size=512',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
