import type { MetaFunction } from '@remix-run/node';
import { Article, Section } from '~/components/semantic';

export const meta: MetaFunction = () => {
	return [
		{ title: 'Guise: About' },
		{ name: 'description', content: 'about guise' },
		{ tagName: 'link', rel: 'canonical', href: '/about' },
	];
};

export default function About() {
	return (
		<Article>
			<Section>
				<h1>What is Guise?</h1>
				<p>
					Guise is a powerful and intuitive tool designed specifically for
					developers to effortlessly create, manage, and apply themes across a
					multitude of applications. Whether you're a developer looking to unify
					your tool themes or a Linux ricing enthusiast striving for the perfect
					desktop aesthetic, Guise offers a powerful and elegant solution.
				</p>
				<blockquote>
					<p>
						Say goodbye to fragmented theming efforts and embrace a cohesive,
					</p>
					<footer>personalized development environment with Guise.</footer>
				</blockquote>
				<p>
					Stay tuned for release details and documentation to begin your journey
					with universal theming!
				</p>
			</Section>
		</Article>
	);
}
