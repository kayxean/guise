import { Browser } from '~/features/browser/provider';
import { createMeta } from '~/meta';

export const meta = createMeta('chromium');

export default function Chromium() {
  return <Browser />;
}
