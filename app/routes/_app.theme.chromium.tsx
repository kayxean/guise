import type { MetaFunction } from '@remix-run/node';
import { Article, Section } from '~/components/semantic';

export const meta: MetaFunction = () => {
	return [
		{ title: 'Chromium Theme' },
		{ name: 'description', content: 'guise' },
		{ tagName: 'link', rel: 'canonical', href: '/theme/chromium' },
	];
};

export default function ThemeChromium() {
	return (
		<Article>
			<Section>
				<h1>Chromium Theme</h1>
			</Section>
		</Article>
	);
}
