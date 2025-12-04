import * as stylex from '@stylexjs/stylex';
import type { ComponentProps } from 'react';

const styles = stylex.create({
  list: {
    display: 'grid',
    gap: '1.25rem 1rem',
    gridTemplateColumns: 'repeat(auto-fit, minmax(6rem, 1fr))',
    listStyle: 'none',
    padding: 0,
  },
  item: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  icon: {
    color: '#020304',
  },
  text: {
    fontSize: '0.75rem',
    textAlign: 'center',
  },
});

export function List({ children, ...props }: ComponentProps<'ul'>) {
  return (
    <ul {...stylex.props(styles.list)} {...props}>
      {children}
    </ul>
  );
}

export function Item({
  children,
  name,
  ...props
}: ComponentProps<'li'> & { name: string }) {
  return (
    <li {...stylex.props(styles.item)} {...props}>
      <div {...stylex.props(styles.icon)}>{children}</div>
      <p {...stylex.props(styles.text)}>{name}</p>
    </li>
  );
}
