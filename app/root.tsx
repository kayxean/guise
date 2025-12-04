import type { LinksFunction } from '@remix-run/node';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';
import type { ReactNode } from 'react';
import fonts from './styles/fonts.css?url';
import styles from './styles/style.css?url';

export const links: LinksFunction = () => [
  { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
  { rel: 'stylesheet', href: styles },
  { rel: 'stylesheet', href: fonts },
];

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
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
  return <p>Loading...</p>;
}
