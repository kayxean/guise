import type { MetaFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';
import { Article, Section } from '~/components/semantic';

export const meta: MetaFunction = () => {
	return [
		{ title: 'Guise' },
		{ name: 'description', content: 'guise' },
		{ tagName: 'link', rel: 'canonical', href: '/' },
	];
};

export default function Home() {
	return (
		<Article>
			<Section>
				<h1>Guise: Color and Theme</h1>
				<p>
					Color and theme are two fundamental components of the Guise App. For
					designers, Guise offers powerful color customization, enabling precise
					control over visual aesthetics and branding within their tools. For
					developers and the Linux community, theming provides the ability to
					personalize the entire interface, behavior, and underlying
					configurations of their development environment. By leveraging these
					features, you can craft a truly unique and personalized experience
					tailored to your specific creative or technical needs.
				</p>
				<p>
					Designers can delve into a world of color possibilities, fine-tuning
					palettes, gradients, and individual element colors to achieve perfect
					visual harmony and consistency. Developers and the Linux community can
					build and share comprehensive themes that transform the look and feel
					of their applications, from syntax highlighting to system-wide
					aesthetic overhauls, all while enhancing workflow and efficiency.
				</p>
				<p>
					Whether you're a designer meticulously crafting visual experiences or
					a developer/Linux enthusiast optimizing your workflow, the Guise App
					offers a robust and flexible platform to customize and personalize
					your tools. With Guise, you can create and share sophisticated color
					schemes and powerful themes that elevate your digital experience,
					making it both more enjoyable and highly productive.
				</p>
				<p>Demo pages:</p>
				<ul>
					<li>
						<Link to="/color">Color</Link>: Harmony, Wheel, Details, Mixer,
						Tones, Tints and Shades, Lighten and Darken, UI Theme.
					</li>
					<li>
						<Link to="/theme">Theme</Link>: Chromium, Zed.
					</li>
					<li>
						<Link to="/icons">Icons</Link>: Material.
					</li>
				</ul>
			</Section>
		</Article>
	);
}
