import fs from 'node:fs/promises';
import path from 'node:path';
import { URL } from 'node:url';
import { type Metadata, routes } from './app/routes.ts';

const BASE_URL = 'https://kayxean.github.io/guise';
const BUILD_DIR = path.resolve('build/client');
const TEMPLATE_FILE = path.join(BUILD_DIR, 'index.html');

const INDEX_METADATA: Metadata = routes.index;

const PAGES_METADATA: Metadata[] = Object.keys(routes)
  .filter((key) => key !== 'index')
  .map((key) => routes[key as keyof typeof routes]);

async function generateMetadata(): Promise<void> {
  try {
    const template = await fs.readFile(TEMPLATE_FILE, 'utf-8');
    if (!template) {
      throw new Error(`Could not read template file: ${TEMPLATE_FILE}`);
    }

    const sanitizeHtml = (html: string): string => {
      return html
        .replace(/(\r\n|\n|\r)/gm, '')
        .replace(/\s+/g, ' ')
        .trim();
    };
    const content = sanitizeHtml(template);

    const createCanonical = (pagePath: string, baseUrl: string) => {
      const _base = baseUrl.replace(/\/$/, '');
      const _path = pagePath.replace(/^\//, '');
      return `${_base}/${_path}`;
    };

    const injectMetadata = (metadata: Metadata): string => {
      const title = `<title>${metadata.title}</title>`;
      const description = `<meta name="description" content="${metadata.description}"/>`;
      const canonical = `<link rel="canonical" href="${createCanonical(metadata.canonical, BASE_URL)}"/>`;

      return `${title}${description}${canonical}`;
    };

    const indexMetadata = injectMetadata(INDEX_METADATA);
    const indexContent = content.replace('<head>', `<head>${indexMetadata}`);

    await fs.writeFile(TEMPLATE_FILE, indexContent, 'utf-8');
    for (const pageMeta of PAGES_METADATA) {
      const pageMetadata = injectMetadata(pageMeta);
      const pageContent = content.replace('<head>', `<head>${pageMetadata}`);

      const fileName = pageMeta.canonical.replace(/^\//, '');
      const pageFile = path.join(BUILD_DIR, `${fileName}.html`);

      await fs.writeFile(pageFile, pageContent, 'utf-8');
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error during custom page generation:', errorMessage);
    process.exit(1);
  }
}

generateMetadata();
