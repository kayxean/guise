import type { MetaFunction } from '@remix-run/node';

export interface Metadata {
  title: string;
  description: string;
  canonical: string;
}

export const routes = {
  index: {
    title: 'Guise',
    description: 'Design with Every Hue',
    canonical: '/',
  },
  chromium: {
    title: 'Chromium',
    description: 'Create a Chromium-based browser theme with ease',
    canonical: '/chromium',
  },
} satisfies { [key: string]: Metadata };

export const createMeta = (key: keyof typeof routes): MetaFunction => {
  const meta = routes[key];

  if (!meta) {
    console.error(`Metadata not found for key: ${key}`);
    return () => [];
  }

  return () => {
    return [
      { title: meta.title },
      { name: 'description', content: meta.description },
      { tagName: 'link', rel: 'canonical', href: meta.canonical },
    ];
  };
};
