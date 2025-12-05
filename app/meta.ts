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
  about: {
    title: 'About',
    description: 'Learn about our mission and history.',
    canonical: '/about',
  },
  glyphs: {
    title: 'Glyphs',
    description: 'Explore the full library of icons and symbols.',
    canonical: '/glyphs',
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
