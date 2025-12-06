import { Link } from '@remix-run/react';
import { Tabs } from '~/components/browser/tabs';
import { createMeta } from '~/meta';

export const meta = createMeta('chromium');

export default function Chromium() {
  return (
    <article>
      <h1>Chromium</h1>
      <nav>
        <Link to="/">Home</Link>
      </nav>
      <Tabs />
    </article>
  );
}
