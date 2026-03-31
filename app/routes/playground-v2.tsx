import * as stylex from '@stylexjs/stylex';
import type { MetaFunction } from '@remix-run/node';
import { CompositorV2 } from '~/components/compositor-v2';

export const meta: MetaFunction = () => {
  return [
    { title: 'Compositor Playground V2 - Guise' },
    { name: 'description', content: 'Compositor playground demo V2' },
  ];
};

export default function PlaygroundV2Page() {
  return (
    <div {...stylex.props(styles.container)}>
      <CompositorV2 />
    </div>
  );
}

const styles = stylex.create({
  container: {
    position: 'fixed',
    inset: 0,
    margin: 0,
    padding: 0,
    overflow: 'hidden',
    width: '100vw',
    height: '100vh',
  },
});
