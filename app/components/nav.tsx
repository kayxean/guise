import { Link, useLocation } from '@remix-run/react';
import * as stylex from '@stylexjs/stylex';

const styles = stylex.create({
  nav: {
    padding: '0 0.875rem',
  },
  list: {
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    height: '3em',
    listStyle: 'none',
  },
  item: {
    display: 'inline-flex',
  },
  link: {
    fontSize: '0.875rem',
  },
  linkActive: {
    color: '#020304',
  },
  linkInactive: {
    color: '#454647',
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
    </nav>
  );
}
