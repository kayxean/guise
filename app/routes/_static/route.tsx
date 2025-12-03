import { Outlet } from '@remix-run/react';
import { Navigation } from '~/components/nav';

export default function StaticLayout() {
  const STATIC = [
    { name: 'Guise', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Privacy', path: '/privacy' },
    { name: 'Terms', path: '/terms' },
    { name: 'Product', path: '/product' },
  ];

  return (
    <>
      <Navigation routes={STATIC} />
      <main>
        <Outlet />
      </main>
    </>
  );
}
