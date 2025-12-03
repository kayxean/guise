import { Outlet } from '@remix-run/react';
import { Navigation } from '~/components/nav';

export default function Layout() {
  const UI = [
    { name: 'Guise', path: '/' },
    { name: 'Icons', path: '/icons' },
    { name: 'Typography', path: '/typography' },
  ];

  return (
    <>
      <Navigation routes={UI} />
      <main>
        <Outlet />
      </main>
    </>
  );
}
