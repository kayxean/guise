import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { extractMeta } from './extract-meta.ts';
import { getFiles } from './get-files.ts';

interface PageMetadata {
  route: string;
  title: string;
  description: string;
  canonical: string;
}

const BASE_URL = 'https://kayxean.github.io/guise';
const BUILD_DIR = path.resolve('build/client');
const ROUTES_DIR = path.resolve('app/routes');
const TEMPLATE_FILE = path.join(BUILD_DIR, 'index.html');
const HEAD_TAG_REGEX = /<head\s*[^>]*>/i;

const sanitizeHtml = (html: string): string => {
  return html
    .replace(/(\r\n|\n|\r)/gm, '')
    .replace(/\s+/g, ' ')
    .trim();
};

const createCanonical = (pagePath: string): string => {
  const site = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
  const page = pagePath.startsWith('/') ? pagePath.slice(1) : pagePath;
  return page ? `${site}/${page}` : site;
};

const injectMetadata = (metadata: PageMetadata): string => {
  const title = `<title>${metadata.title}</title>`;
  const description = `<meta name="description" content="${metadata.description}"/>`;
  const canonical = `<link rel="canonical" href="${createCanonical(metadata.canonical)}"/>`;
  return `${title}${description}${canonical}`;
};

async function generateMetadata(): Promise<void> {
  try {
    const rawTemplate = await fs.readFile(TEMPLATE_FILE, 'utf-8');
    const baseContent = sanitizeHtml(rawTemplate);

    const files = getFiles(ROUTES_DIR);
    const len = files.length;
    const writePromises: Promise<void>[] = [];

    for (let i = 0; i < len; i++) {
      const file = files[i];
      const rawMeta = extractMeta(file);
      if (!rawMeta) continue;

      let routeKey = path.relative(ROUTES_DIR, file).replace(/\\/g, '/').slice(0, -4);
      if (routeKey === '_index' || routeKey.endsWith('/index')) {
        const lastSlash = routeKey.lastIndexOf('/');
        routeKey = lastSlash === -1 ? 'index' : routeKey.slice(0, lastSlash);
      } else if (routeKey.endsWith('/_index')) {
        routeKey = routeKey.slice(0, -7) || 'index';
      }

      const page: PageMetadata = { route: routeKey, title: '', description: '', canonical: '' };
      const metaLen = rawMeta.length;
      for (let j = 0; j < metaLen; j++) {
        const tag = rawMeta[j];
        if ('title' in tag && typeof tag.title === 'string') {
          page.title = tag.title;
        } else if ('name' in tag && tag.name === 'description' && 'content' in tag && typeof tag.content === 'string') {
          page.description = tag.content;
        } else if (
          'tagName' in tag &&
          tag.tagName === 'link' &&
          'rel' in tag &&
          tag.rel === 'canonical' &&
          'href' in tag &&
          typeof tag.href === 'string'
        ) {
          page.canonical = tag.href;
        }
      }

      const pageMetadataHtml = injectMetadata(page);
      const pageContent = baseContent.replace(HEAD_TAG_REGEX, (match) => `${match}${pageMetadataHtml}`);

      const fileName = page.route === 'index' ? 'index' : page.route;
      const targetFile = path.join(BUILD_DIR, `${fileName}.html`);

      writePromises.push(fs.writeFile(targetFile, pageContent, 'utf-8'));
    }

    await Promise.all(writePromises);
    console.log(`Successfully generated SEO pages for ${writePromises.length} routes.`);
  } catch (error) {
    console.error('Build failed:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

generateMetadata();
