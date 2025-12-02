import type { MetaFunction } from '@remix-run/node';
import { Article, Section } from '~/components/semantic';

export const meta: MetaFunction = () => {
	return [
		{ title: 'Create' },
		{ name: 'description', content: 'guise' },
		{ tagName: 'link', rel: 'canonical', href: '/create' },
	];
};

export default function Create() {
	return (
		<Article>
			<Section>
				<h1>Create</h1>
				<p>
					There are various options for creating themes or color palettes. Users
					can start by selecting from a library of predefined themes, offering a
					quick way to establish a visual style. For more control, they might
					use an interactive color picker to design custom palettes from
					scratch, adjusting hues, saturation, and lightness to achieve the
					desired look.
				</p>
				<p>
					Additionally, some tools allow for importing existing color palettes
					from external sources or generating them based on specific inputs like
					a base color or an image. This flexibility enables users to either
					leverage ready-made solutions or craft highly personalized visual
					experiences.
				</p>
			</Section>
		</Article>
	);
}
