import type { LinksFunction } from '@remix-run/node';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useBeforeUnload,
} from '@remix-run/react';
import type { ReactNode } from 'react';
import { useCallback, useLayoutEffect, useState } from 'react';
import { SplashScreen } from './components/loading';
import styles from './styles/style.css?url';

export const links: LinksFunction = () => [
  { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
  { rel: 'stylesheet', href: styles },
];

export function Layout({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useBeforeUnload(
    useCallback(() => {
      setIsLoading(true);
    }, []),
  );

  useLayoutEffect(() => {
    const head = document.head;
    head.querySelector('title')?.remove();
    head.querySelector('meta[name="description"]')?.remove();
    head.querySelector('link[rel="canonical"]')?.remove();
  }, []);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#020304" />
        <meta name="color-scheme" content="dark" />
        <Meta />
        <Links />
      </head>
      <body>
        <div id="root">{isLoading ? <SplashScreen /> : children}</div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function HydrateFallback() {
  return <SplashScreen />;
}
