import { Outlet } from '@remix-run/react';
import { Footer } from '~/components/footer';
import { Navigation } from '~/components/nav';

export default function Layout() {
  const UI = [
    { name: 'Icons', path: '/icons' },
    { name: 'Typography', path: '/typography' },
  ];

  return (
    <>
      <Navigation routes={UI} />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
