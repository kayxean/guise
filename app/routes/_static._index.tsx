import type { MetaFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';
import { Article } from '~/components/article';

export const meta: MetaFunction = () => {
  return [
    { title: 'Guise' },
    { name: 'description', content: 'guise' },
    { tagName: 'link', rel: 'canonical', href: '/' },
  ];
};

export default function Home() {
  return (
    <Article>
      <h1>Guise</h1>
      <p>A powerful color and theme customization tool.</p>
      <p>
        For designers, Guise offers powerful color customization, enabling
        precise control over visual aesthetics and branding within their tools.
      </p>
      <p>
        For developers and the Linux community, theming provides the ability to
        personalize the entire interface, behavior, and underlying
        configurations of their development environment.
      </p>
      <p>
        By leveraging these features, you can craft a truly unique and
        personalized experience tailored to your specific creative or technical
        needs.
      </p>
      <p>Demo pages:</p>
      <ul>
        <li>
          <strong>App Layout</strong>
          <ul>
            <li>
              <Link to="/create">Create</Link>
            </li>
            <li>
              <Link to="/color">Color</Link>
            </li>
            <li>
              <Link to="/theme">Theme</Link>
            </li>
            <li>
              <Link to="/theme/chromium">Chromium</Link>
            </li>
            <li>
              <Link to="/theme/zed">Zed</Link>
            </li>
          </ul>
        </li>
        <li>
          <strong>Static Layout</strong>
          <ul>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/privacy">Privacy</Link>
            </li>
            <li>
              <Link to="/terms">Terms</Link>
            </li>
          </ul>
        </li>
        <li>
          <strong>UI Layout</strong>
          <ul>
            <li>
              <Link to="/icons">Icons</Link>
            </li>
            <li>
              <Link to="/typography">Typography</Link>
            </li>
          </ul>
        </li>
      </ul>
    </Article>
  );
}
