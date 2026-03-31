import * as stylex from '@stylexjs/stylex';
import type { MetaFunction } from '@remix-run/node';
import { Compositor } from '~/components/Compositor';

export const meta: MetaFunction = () => {
  return [
    { title: 'Compositor Playground - Guise' },
    { name: 'description', content: 'Compositor playground demo' },
  ];
};

export default function PlaygroundPage() {
  return (
    <div {...stylex.props(styles.container)}>
      <Compositor />
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
