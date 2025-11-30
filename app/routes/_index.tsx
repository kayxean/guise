import type { MetaFunction } from '@remix-run/node';
import { Article } from '~/components/semantic';

export const meta: MetaFunction = () => {
	return [
		{ title: 'Guise: Mask and Theme' },
		{
			name: 'description',
			content: 'implies masking or theming the underlying tool',
		},
		{ tagName: 'link', rel: 'canonical', href: '/' },
	];
};

export default function Home() {
	return (
		<Article>
			<h1>Home</h1>
		</Article>
	);
}
