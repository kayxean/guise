import { Link } from '@remix-run/react';
import { createMeta } from '~/meta';

export const meta = createMeta('index');

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
