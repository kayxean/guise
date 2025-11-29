import type { ComponentProps } from "react";
import * as stylex from "@stylexjs/stylex";

const styles = stylex.create({
  layout: {
    padding: "0 0.875rem",
  },
  article: {
    display: "grid",
    gap: "2rem",
    margin: "0 auto",
    maxWidth: "48em",
  },
  section: {
    display: "inline-grid",
  },
});

export function Article({ children, ...props }: ComponentProps<"article">) {
  return (
    <div {...stylex.props(styles.layout)}>
      <article {...stylex.props(styles.article)} {...props}>
        {children}
      </article>
    </div>
  );
}

export function Section({ children, ...props }: ComponentProps<"section">) {
  return (
    <section {...stylex.props(styles.section)} {...props}>
      {children}
    </section>
  );
}
