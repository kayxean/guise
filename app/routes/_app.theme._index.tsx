import type { MetaFunction } from '@remix-run/node';
import { Article, Section } from '~/components/semantic';

export const meta: MetaFunction = () => {
	return [
		{ title: 'Theme' },
		{ name: 'description', content: 'guise' },
		{ tagName: 'link', rel: 'canonical', href: '/theme' },
	];
};

export default function Theme() {
	return (
		<Article>
			<Section>
				<h1>Theme</h1>
			</Section>
		</Article>
	);
}
