import { Link } from '@remix-run/react';
import { TabList } from '~/features/browser/tab-list';
import { TabPanel } from '~/features/browser/tab-panel';
import { createMeta } from '~/meta';

export const meta = createMeta('chromium');

export default function Chromium() {
  return (
    <article>
      <h1>Chromium</h1>
      <nav>
        <Link to="/">Home</Link>
      </nav>
      <TabList />
      <TabPanel />
    </article>
  );
}
