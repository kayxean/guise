import type { MetaFunction } from '@remix-run/node';
import { Article, Section } from '~/components/semantic';

export const meta: MetaFunction = () => {
	return [
		{ title: 'Zed Theme' },
		{ name: 'description', content: 'guise' },
		{ tagName: 'link', rel: 'canonical', href: '/theme/zed' },
	];
};

export default function ThemeZed() {
	return (
		<Article>
			<Section>
				<h1>Zed Theme</h1>
			</Section>
		</Article>
	);
}
