import type { MetaFunction } from '@remix-run/node';
import { Article } from '~/components/article';

export const meta: MetaFunction = () => {
  return [
    { title: 'Color' },
    { name: 'description', content: 'guise' },
    { tagName: 'link', rel: 'canonical', href: '/color' },
  ];
};

export default function Color() {
  return (
    <Article>
      <h1>Color</h1>
    </Article>
  );
}
