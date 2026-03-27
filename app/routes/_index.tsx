import * as stylex from '@stylexjs/stylex';
import type { MetaFunction } from '@remix-run/node';
import { grades, leadings, sizes, spacings, viewports } from '~/styles/constants.stylex';
import { fonts } from '~/styles/variables.stylex';

export const meta: MetaFunction = () => {
  return [
    { title: 'Guise' },
    { name: 'description', content: 'An attempt at building my dream OS in the browser' },
    { tagName: 'link', rel: 'canonical', href: '/' },
  ];
};

export default function HomePage() {
  return (
    <article {...stylex.props(styles.card)}>
      <h1 {...stylex.props(styles.title)}>Guise</h1>
      <p {...stylex.props(styles.description)}>
        An attempt at building my dream OS in the browser.
      </p>
    </article>
  );
}

const styles = stylex.create({
  card: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    minHeight: viewports.dvh,
    justifyContent: 'center',
    paddingBlock: spacings.xs,
    paddingInline: spacings.xs,
  },
  title: {
    fontFamily: fonts.code,
    fontSize: sizes['5xl'],
    fontWeight: grades.semibold,
    lineHeight: leadings.tight,
  },
  description: {
    fontFamily: fonts.flex,
    fontSize: sizes.lg,
    lineHeight: leadings.tight,
  },
});
