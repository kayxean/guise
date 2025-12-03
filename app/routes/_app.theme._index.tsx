import type { MetaFunction } from '@remix-run/node';
import { Article } from '~/components/article';

export const meta: MetaFunction = () => {
  return [
    { title: 'Theme' },
    { name: 'description', content: 'guise' },
    { tagName: 'link', rel: 'canonical', href: '/theme' },
  ];
};

export default function Theme() {
  return (
    <Article>
      <h1>Theme</h1>
    </Article>
  );
}
