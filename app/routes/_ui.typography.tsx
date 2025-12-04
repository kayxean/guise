import type { MetaFunction } from '@remix-run/node';
import { Article } from '~/components/article';

export const meta: MetaFunction = () => {
  return [
    { title: 'Typography' },
    { name: 'description', content: 'guise' },
    { tagName: 'link', rel: 'canonical', href: '/typography' },
  ];
};

export default function Typography() {
  return (
    <Article>
      <header>
        <h1>Typography is the visual representation of written language.</h1>
        <h2>
          It can be used to arrange type for legibility, readability, and
          appeal.
        </h2>
        <p>
          Typography is used in a variety of applications, including web pages,
          print media, and digital interfaces.
        </p>
      </header>

      <p>
        Effective typography creates a clear visual hierarchy, allowing users to
        scan content and quickly grasp its structure and key points. This is
        achieved through the strategic use of different heading levels, font
        sizes, weights, and colors.
      </p>

      <h3>Establishing Visual Flow with H3</h3>
      <p>
        From main titles to supporting details, each piece of text plays a role.
        Below, we demonstrate the standard heading levels, essential for
        structuring content logically and aesthetically.
      </p>

      <p>
        <strong>Note on Heading Usage (H4-H6):</strong> To ensure a clean,
        accessible, and easily scannable content structure, our guidelines
        strongly recommend against using <code>&lt;h4&gt;</code>,{' '}
        <code>&lt;h5&gt;</code>, and <code>&lt;h6&gt;</code> for main article
        content.
      </p>

      <p>
        If you find yourself needing these deeper levels, consider restructuring
        your content using lists, breaking sections into standalone articles, or
        employing other visual grouping elements. A hierarchy of H1-H3 typically
        provides sufficient structure for most webpages.
      </p>

      <hr />

      <h2>Paragraphs, Emphasis, and Links</h2>
      <p>
        The backbone of any textual content, paragraphs should be easy to read.
        Use <em>italics</em> for emphasis, foreign words, or titles of works.
        Employ <strong>bold text</strong> for strong statements, keywords, or to
        highlight crucial information. Links, like this one to{' '}
        <a href="https://practicaltypography.com/">Practical Typography</a>,
        should be clearly distinguishable and indicate interactivity, often with
        a distinct color and hover state.
      </p>
      <p>
        This paragraph demonstrates a standard block of text. Notice how the
        line height (leading) and character spacing (kerning and tracking)
        contribute to its overall readability. A comfortable measure (line
        length, typically 45-75 characters) is crucial for preventing eye strain
        and ensuring a pleasant reading experience across various devices.
      </p>

      <blockquote>
        <p>
          "Typography is two-dimensional architecture, based on experience and
          fantasy, two-dimensional with a three-dimensional effect."
        </p>
        <footer>— Hermann Zapf, renowned type designer</footer>
      </blockquote>

      <h2>Lists and Their Structure</h2>
      <p>
        Lists are vital for breaking up large blocks of text and presenting
        information in an easily digestible format. They naturally create a
        visual hierarchy and improve scannability.
      </p>

      <h3>Unordered Lists for Grouped Items</h3>
      <ul>
        <li>Choose a primary font family for body text.</li>
        <li>Select a secondary font for headlines or specific UI elements.</li>
        <li>Define font sizes for all heading levels (h1-h6) and body text.</li>
        <li>
          Establish baseline grid and line heights (leading).
          <ul>
            <li>For paragraphs, aim for 1.5 - 1.7 times the font size.</li>
            <li>
              Headings can often have tighter line heights for compactness.
            </li>
          </ul>
        </li>
        <li>Consider contrast and color palette for accessibility.</li>
      </ul>

      <h3>Ordered Lists for Sequential Information</h3>
      <ol>
        <li>
          Start with a clear content outline and information architecture.
        </li>
        <li>Prioritize information using an appropriate heading hierarchy.</li>
        <li>
          Apply consistent font styles and weights across all text elements:
          <ol type="a">
            <li>Body text for long-form content.</li>
            <li>Captions, metadata, and fine print.</li>
            <li>Call-to-action elements and interactive text.</li>
          </ol>
        </li>
        <li>
          Test readability and responsiveness across different devices and
          screen sizes.
        </li>
      </ol>

      <hr />

      <h2>Code Presentation</h2>
      <p>
        Presenting code effectively is crucial in technical documentation and
        educational contexts. Inline code, like <code>&lt;pre&gt;</code> or{' '}
        <code>&lt;code&gt;</code> tags, should use a monospaced font and blend
        seamlessly with surrounding text, indicating a technical term or
        command.
      </p>
      <p>
        For larger blocks of code, a dedicated code block ensures syntax
        highlighting, proper indentation, and excellent legibility. To execute
        this example, press <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>R</kbd>.
      </p>

      <pre>
        <code>{`interface User {
  name: string;
  age: number;
}

function greetUser(user: User): string {
  return \`Hello, \${user.name}! You are \${user.age} years old.\`;
}

const currentUser: User = { name: 'Alice', age: 30 };
console.log(greetUser(currentUser));`}</code>
      </pre>

      <p>
        This typography demo aims to showcase common HTML elements and provide
        insight into effective text presentation. Remember, good typography
        significantly enhances readability, accessibility, and overall user
        experience.
      </p>
    </Article>
  );
}
