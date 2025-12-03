import type { MetaFunction } from '@remix-run/node';
import { Article } from '~/components/article';

export const meta: MetaFunction = () => {
  return [
    { title: 'About' },
    { name: 'description', content: 'guise' },
    { tagName: 'link', rel: 'canonical', href: '/about' },
  ];
};

export default function About() {
  return (
    <Article>
      <h1>What is Guise?</h1>
      <p>It's about color and theme</p>
      <p>
        Guise is a powerful and intuitive tool designed specifically for
        developers to effortlessly create, manage, and apply themes across a
        multitude of applications
      </p>
      <p>
        Whether you're a developer looking to unify your tool themes or a Linux
        ricing enthusiast striving for the perfect desktop aesthetic, Guise
        offers a powerful and elegant solution.
      </p>
      <p>
        Say goodbye to fragmented theming efforts and embrace a cohesive,
        personalized development environment with ease.
      </p>
      <p>
        Stay tuned for release details and documentation to begin your journey
        with universal theming!
      </p>
    </Article>
  );
}
