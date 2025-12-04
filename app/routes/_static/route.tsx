import { Outlet } from '@remix-run/react';
import { Footer } from '~/components/footer';
import { Navigation } from '~/components/nav';

export default function StaticLayout() {
  const STATIC = [
    { name: 'About', path: '/about' },
    { name: 'Privacy', path: '/privacy' },
    { name: 'Terms', path: '/terms' },
  ];

  return (
    <>
      <Navigation routes={STATIC} />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
