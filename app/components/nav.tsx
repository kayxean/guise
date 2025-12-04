import { Link, useLocation } from '@remix-run/react';
import * as stylex from '@stylexjs/stylex';
import { GuiseLogo, Menu } from '~/icons/material';
import { ButtonIcon } from './button';

const styles = stylex.create({
  nav: {
    display: 'grid',
    gridTemplateColumns: '1fr auto 1fr',
    height: '3.875rem',
    padding: '0 0.875rem',
  },
  brand: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'flex-start',
  },
  logo: {
    color: '#020304',
  },
  svg: {
    height: '2.25rem',
    width: '3.375rem',
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
    fontSize: '1rem',
    fontWeight: 500,
    lineHeight: '2.25rem',
    padding: '0 0.75rem',
  },
  linkActive: {
    color: '#020304',
  },
  linkInactive: {
    color: '#454647',
  },
  action: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'flex-end',
  },
});

type Route = {
  name: string;
  path: string;
};

export function Navigation({ routes }: { routes: Route[] }) {
  const location = useLocation();

  return (
    <nav {...stylex.props(styles.nav)}>
      <div {...stylex.props(styles.brand)}>
        <Link to="/" {...stylex.props(styles.logo)}>
          <GuiseLogo {...stylex.props(styles.svg)} />
        </Link>
      </div>
      <ul {...stylex.props(styles.list)}>
        {routes.map((route) => {
          const isActive = route.path === location.pathname;

          return (
            <li key={route.name} {...stylex.props(styles.item)}>
              <Link
                to={route.path}
                {...stylex.props(
                  styles.link,
                  isActive ? styles.linkActive : styles.linkInactive,
                )}
              >
                {route.name}
              </Link>
            </li>
          );
        })}
      </ul>
      <div {...stylex.props(styles.action)}>
        <ButtonIcon>
          <Menu />
        </ButtonIcon>
      </div>
    </nav>
  );
}
