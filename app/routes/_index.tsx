import type { MetaFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';

export const meta: MetaFunction = () => {
  return [
    { title: 'Guise' },
    { name: 'description', content: 'Design with Every Hue' },
    { tagName: 'link', rel: 'canonical', href: '/' },
  ];
};

export default function HomePage() {
  return (
    <article>
      <h1>Guise</h1>
      <nav>
        <Link to="/chromium">Chromium</Link>
      </nav>
    </article>
  );
}
