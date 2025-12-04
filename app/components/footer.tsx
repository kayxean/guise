import { Link } from '@remix-run/react';
import * as stylex from '@stylexjs/stylex';
import { GuiseLogo } from '~/icons/material';

const styles = stylex.create({
  footer: {
    margin: '4rem auto 0',
    maxWidth: '80rem',
    padding: '3.5rem 0.75rem',
    width: '100%',
  },
  layout: {
    borderTopColor: '#d1d1d1',
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    display: 'flex',
    flexDirection: {
      default: 'column',
      '@media (width >= 40rem)': 'row',
    },
    gap: '1rem',
    justifyContent: 'space-between',
    paddingTop: '2rem',
  },
  brand: {
    alignItems: 'center',
    display: 'flex',
    gap: '0.25rem',
    justifyContent: 'flex-start',
  },
  logo: {
    color: '#020304',
  },
  svg: {
    height: '2rem',
    width: '3rem',
  },
  hidden: {
    clip: 'rect(0,0,0,0)',
    height: '1px',
    margin: '-1px',
    overflow: 'hidden',
    position: 'absolute',
    whiteSpace: 'nowrap',
    width: '1px',
  },
  slogan: {
    fontSize: '1rem',
    lineHeight: '2rem',
  },
  list: {
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'wrap',
    listStyle: 'none',
  },
  item: {
    display: 'inline-flex',
  },
  link: {
    color: '#020304',
    fontSize: {
      default: '0.875rem',
      '@media (width >= 40rem)': '1rem',
    },
    lineHeight: '2.25rem',
    padding: '0 0.75rem',
  },
});

export function Footer() {
  return (
    <footer {...stylex.props(styles.footer)}>
      <div {...stylex.props(styles.layout)}>
        <div {...stylex.props(styles.brand)}>
          <Link to="/" {...stylex.props(styles.logo)}>
            <GuiseLogo {...stylex.props(styles.svg)} />
            <span {...stylex.props(styles.hidden)}>Guise</span>
          </Link>
          <p {...stylex.props(styles.slogan)}>Design with Every Hue</p>
        </div>
        <Navigation
          routes={[
            { name: 'About', path: '/about' },
            { name: 'Privacy', path: '/privacy' },
            { name: 'Terms', path: '/terms' },
            { name: 'Contribute', path: 'https://github.com/kayxean/guise' },
          ]}
        />
      </div>
    </footer>
  );
}

type Route = {
  name: string;
  path: string;
};

function Navigation({ routes }: { routes: Route[] }) {
  return (
    <ul {...stylex.props(styles.list)}>
      {routes.map((route) => (
        <li key={route.name} {...stylex.props(styles.item)}>
          <Link to={route.path} {...stylex.props(styles.link)}>
            {route.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}
