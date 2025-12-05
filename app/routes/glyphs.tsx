import { Link } from '@remix-run/react';
import * as stylex from '@stylexjs/stylex';
import { createMeta } from '~/meta';

export const meta = createMeta('glyphs');

const styles = stylex.create({
  section: {
    marginBottom: '1rem',
  },
});

const glyphs = [
  {
    name: 'latin-lowercase',
    content: 'a b c d e f g h i j k l m n o p q r s t u v w x y z',
  },
  {
    name: 'latin-uppercase',
    content: 'A B C D E F G H I J K L M N O P Q R S T U V W X Y Z',
  },
  {
    name: 'latin-extended',
    content:
      'à á â ã ä å æ ç è é ê ë ì í î ï ð ñ ò ó ô õ ö ø œ ß þ ù ú û ü ý ÿ',
  },
  {
    name: 'numbers',
    content: '0 1 2 3 4 5 6 7 8 9 ⁰ ¹ ² ³ ⁴ ⁵ ⁶ ⁷ ⁸ ⁹ ₀ ₁ ₂ ₃ ₄ ₅ ₆ ₇ ₈ ₉',
  },
  {
    name: 'punctuation',
    content: '.,:;?!-/()[]{}<>"\'«»„“”‘’—–…',
  },
  {
    name: 'math-operators',
    content: '+ - × ÷ = ≠ < > ≤ ≥ ≈ ± √ ∑ ∫ ∞ ∆ ∂ ∇',
  },
  {
    name: 'spacing-modifiers',
    content:
      '\u00A0 \u2002 \u2003 \u2009 \u200A \u200B \u200C \u200D \u200E \u200F',
  },
  {
    name: 'currency-symbols',
    content: '$ € £ ¥ ₽ ₹ ¢ ₩ ₺ ₴ ₪ ₫',
  },
  {
    name: 'arrows',
    content: '← ↑ → ↓ ↔ ↕ ↖ ↗ ↘ ↙ ⏎ ⇐ ⇑ ⇒ ⇓ ⇔ ⇕',
  },
  {
    name: 'technical-symbols',
    content: '~ ` | ^ _ % & @ # \\',
  },
  {
    name: 'general-symbols',
    content: '© ® ™ ¶ § † ‡ ★ ☆ ▲ ▼ ▶ ◀ ◆ ■ ● ✔ ✗ ♪ ♫ ⌘ ⌥ ⇧ ⌃',
  },
  {
    name: 'marks',
    content: '´ ` ¨ ˆ ˜ ˚ ¸ ˇ ¯ ˘ ˙ º ª',
  },
];

export default function Glyphs() {
  return (
    <article>
      <h1>Glyphs</h1>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/glyphs">Glyphs</Link>
      </nav>
      <section {...stylex.props(styles.section)}>
        {glyphs.map((item) => (
          <p key={item.name}>{item.content}</p>
        ))}
      </section>
      <section {...stylex.props(styles.section)}>
        {glyphs.map((item) => (
          <p key={item.name}>
            <code>{item.content}</code>
          </p>
        ))}
      </section>
    </article>
  );
}
