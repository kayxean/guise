import type { MetaFunction } from '@remix-run/node';
import { Browser } from '~/features/browser';

export const meta: MetaFunction = () => {
  return [
    { title: 'Chromium' },
    { name: 'description', content: 'Create a Chromium-based browser theme with ease' },
    { tagName: 'link', rel: 'canonical', href: '/chromium' },
  ];
};

export default function Chromium() {
  return <Browser />;
}
