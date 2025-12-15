import { Playground } from '~/features/color/playground';
import { createMeta } from '~/routes';

export const meta = createMeta('color');

export default function ColorPage() {
  return <Playground />;
}
