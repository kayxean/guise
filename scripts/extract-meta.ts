import type { MetaDescriptor } from '@remix-run/node';
import * as fs from 'node:fs';

export function extractMeta(filePath: string): MetaDescriptor[] | null {
  const content = fs.readFileSync(filePath, 'utf8');

  const metaRegex =
    /export\s+(?:const|function)\s+meta[\s\S]*?return\s*(\[[\s\S]*?\]);|export\s+const\s+meta[\s\S]*?=\s*(\[[\s\S]*?\]);/m;
  const match = content.match(metaRegex);

  if (!match) return null;

  let arrayStr = match[1] || match[2];

  arrayStr = arrayStr.replace(/\/\/.*/g, '').replace(/\/\*[\s\S]*?\*\//g, '');

  const extractedTags: MetaDescriptor[] = [];
  const objectRegex = /\{([\s\S]*?)\}/g;

  while (true) {
    const objMatch = objectRegex.exec(arrayStr);
    if (objMatch === null) break;

    const propsStr = objMatch[1];
    const obj: MetaDescriptor = {};
    const propRegex = /(\w+)\s*:\s*[`"']([\s\S]*?)[`"']/g;

    while (true) {
      const propMatch = propRegex.exec(propsStr);
      if (propMatch === null) break;

      const [, key, value] = propMatch;
      obj[key] = value;
    }

    if (Object.keys(obj).length > 0) {
      extractedTags.push(obj);
    }
  }

  return extractedTags.length > 0 ? extractedTags : null;
}
