import type { MetaFunction } from '@remix-run/node';
import { Article } from '~/components/article';

export const meta: MetaFunction = () => {
  return [
    { title: 'Product' },
    { name: 'description', content: 'guise' },
    { tagName: 'link', rel: 'canonical', href: '/product' },
  ];
};

export default function About() {
  return (
    <Article>
      <header>
        <h1>You can now filter your illustration search by style</h1>
        <h2>Searching for illustrations just got a major upgrade.</h2>
        <p>Natalie Brennan • December 02, 2025</p>
      </header>
      <p>
        “How do I find the <em>right</em> illustration style, quickly?” Today,
        we’re improving that.
      </p>
      <p>
        You can now filter any search on Unsplash by{' '}
        <strong>illustration style</strong>.
      </p>
      <p>
        No more scrolling endlessly. No more guessing what’s “flat-ish” or
        “hand-drawn-ish.” No more downloading something only to realize it
        clashes with the rest of your design system.
      </p>
      <p>
        Just choose the style you need, and instantly narrow your search. It’s
        simple, fast, and makes pulling visuals into your workflow feel a whole
        lot smoother.
      </p>
      <h2>What this looks like in action</h2>
      <p>
        Let’s say you’re searching for <strong>“flower.”</strong> Before today,
        you’d get everything from line drawings to 3D renders to textured
        sketches, all mixed together.
      </p>
      <p>
        Now, you can pick the style you want and instantly see only{' '}
        <strong>flat</strong> flowers, only <strong>hand-drawn</strong> flowers,
        only <strong>line-art</strong> flowers, or only <strong>3D</strong>{' '}
        flowers.
      </p>
      <p>Simple. Organized. Fast.</p>
      <h2>The four styles you can filter by</h2>
      <p>
        We’re launching with four of the most-used illustration styles across
        the web today. Each one unlocks a different look, a different vibe, and
        depending on your project, a very different story.
      </p>
      <h3>Flat</h3>
      <p>
        A 2D illustration style showcasing clean lines, bold colors and simple
        shapes.
      </p>
      <h3>Hand-drawn</h3>
      <p>
        From sketchy lines to textured strokes, this style highlights digital
        works that mimic the look and feel of hand-drawn art.
      </p>
      <h3>Line-art</h3>
      <p>
        From delicate outlines to bold strokes, this style showcases crisp,
        minimal line drawings designed to add a timeless and adaptable style to
        any project.
      </p>
      <h3>3D</h3>
      <p>
        Vectors that use shading, gradients, and perspective to create a sense
        of volume and space, adding a lifelike, tactile quality to digital
        illustrations.
      </p>
      <h2>Why this matters</h2>
      <p>
        Illustrations are becoming a bigger part of how people design, teach,
        build, and communicate, and the library is growing fast.
      </p>
      <p>
        These new style filters make Unsplash’s illustration library not just
        bigger, but <em>smarter</em>.
      </p>
      <p>
        It’s one more step toward a platform where you can create faster,
        explore deeper, and find exactly what you need without breaking your
        flow.
      </p>
      <p>And this is just the start.</p>
    </Article>
  );
}
