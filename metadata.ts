import fs from 'node:fs/promises';
import path from 'node:path';
import { type Metadata, routes } from './app/routes.ts';

const BASE_URL = 'https://kayxean.github.io/guise';
const BUILD_DIR = path.resolve('build/client');
const TEMPLATE_FILE = path.join(BUILD_DIR, 'index.html');
const HEAD_TAG_REGEX = /<head\s*[^>]*>/i;

const ALL_PAGES_METADATA: Metadata[] = Object.values(routes);

const sanitizeHtml = (html: string): string => {
  return html
    .replace(/(\r\n|\n|\r)/gm, '')
    .replace(/\s+/g, ' ')
    .trim();
};

const createCanonical = (pagePath: string): string => {
  const site = BASE_URL.replace(/\/$/, '');
  const page = pagePath.replace(/^\//, '');
  return page ? `${site}/${page}` : site;
};

const injectMetadata = (metadata: Metadata): string => {
  const title = `<title>${metadata.title}</title>`;
  const description = `<meta name="description" content="${metadata.description}"/>`;
  const canonical = `<link rel="canonical" href="${createCanonical(metadata.canonical)}"/>`;
  return `${title}${description}${canonical}`;
};

async function processAndWritePage(baseContent: string, metadata: Metadata): Promise<void> {
  const pageMetadata = injectMetadata(metadata);

  const pageContent = baseContent.replace(HEAD_TAG_REGEX, (match) => {
    return `${match}${pageMetadata}`;
  });

  const fileName = metadata.canonical.replace(/^\//, '');

  const pageFile = fileName ? path.join(BUILD_DIR, `${fileName}.html`) : TEMPLATE_FILE;

  await fs.writeFile(pageFile, pageContent, 'utf-8');
}

async function generateMetadata(): Promise<void> {
  try {
    const rawTemplate = await fs.readFile(TEMPLATE_FILE, 'utf-8');
    if (!rawTemplate) {
      throw new Error(`Could not read template file: ${TEMPLATE_FILE}`);
    }
    const baseContent = sanitizeHtml(rawTemplate);

    const writePromises = ALL_PAGES_METADATA.map((metadata) => processAndWritePage(baseContent, metadata));

    await Promise.all(writePromises);

    console.log(`Successfully generated metadata for ${ALL_PAGES_METADATA.length} pages.`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error during custom page generation:', errorMessage);
    process.exit(1);
  }
}

generateMetadata();
