import * as stylex from '@stylexjs/stylex';
import type { ComponentProps } from 'react';

const styles = stylex.create({
  icon: {
    alignItems: 'center',
    cursor: 'pointer',
    display: 'inline-flex',
    height: '2.5rem',
    justifyContent: 'center',
    width: '2.5rem',
  },
});

export function ButtonIcon({ children, ...props }: ComponentProps<'button'>) {
  return (
    <button {...stylex.props(styles.icon)} {...props}>
      {children}
    </button>
  );
}
