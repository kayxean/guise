import type { MetaFunction } from '@remix-run/node';
import { Article, Section } from '~/components/semantic';

export const meta: MetaFunction = () => {
	return [
		{ title: 'Color' },
		{ name: 'description', content: 'guise' },
		{ tagName: 'link', rel: 'canonical', href: '/color' },
	];
};

export default function Color() {
	return (
		<Article>
			<Section>
				<h1>Color</h1>
			</Section>
		</Article>
	);
}
