import type { MetaFunction } from '@remix-run/node';
import { Article } from '~/components/article';

export const meta: MetaFunction = () => {
  return [
    { title: 'Privacy Policy' },
    { name: 'description', content: 'guise' },
    { tagName: 'link', rel: 'canonical', href: '/privacy' },
  ];
};

export default function Privacy() {
  return (
    <Article>
      <h1>Privacy Policy</h1>
      <p>
        At Guise, your privacy is paramount. We want to be absolutely clear: we
        do not collect any personal data from you. There is no remote database
        whatsoever associated with the Guise app. All data relevant to your use
        of Guise is stored exclusively on your device.
      </p>
      <p>
        We utilize{' '}
        <a
          href="https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API"
          target="_blank"
          rel="noopener noreferrer"
        >
          IndexedDB
        </a>
        , a client-side database technology built into your web browser, to
        store your information securely and locally. This means your data never
        leaves your device and is not transmitted to us or any third party.
        IndexedDB is widely supported in modern browsers (including Chrome,
        Firefox and Safari), but older browser versions might not fully support
        it, which could affect the app's functionality.
      </p>
      <p>
        Your privacy is fully under your control, as Guise operates entirely
        client-side without relying on external servers for data storage.
      </p>
    </Article>
  );
}
