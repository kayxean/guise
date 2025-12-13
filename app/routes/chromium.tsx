import { Browser } from '~/features/browser';
import { createMeta } from '~/routes';

export const meta = createMeta('chromium');

export default function Chromium() {
  return <Browser />;
}
