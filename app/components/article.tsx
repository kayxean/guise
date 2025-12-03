import * as stylex from '@stylexjs/stylex';
import type { ComponentProps } from 'react';

const styles = stylex.create({
  article: {
    padding: '0 0.875rem',
  },
});

export function Article({ children, ...props }: ComponentProps<'article'>) {
  return (
    <article id="mdx" {...stylex.props(styles.article)} {...props}>
      {children}
    </article>
  );
}
