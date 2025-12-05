import { Link } from '@remix-run/react';
import { createMeta } from '~/meta';

export const meta = createMeta('about');

export default function About() {
  return (
    <article>
      <h1>About</h1>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/glyphs">Glyphs</Link>
      </nav>
    </article>
  );
}
