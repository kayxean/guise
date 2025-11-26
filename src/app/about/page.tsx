import * as stylex from "@stylexjs/stylex";

const styles = stylex.create({
  layout: {
    padding: "0 0.875rem",
  },
  article: {
    display: "grid",
    gap: "2rem",
    margin: "0 auto",
    maxWidth: "64em",
  },
  section: {
    display: "inline-grid",
  },
});

export default function About() {
  return (
    <div {...stylex.props(styles.layout)}>
      <article {...stylex.props(styles.article)}>
        <section {...stylex.props(styles.section)}>
          <h1>What is Guise?</h1>
          <p>
            Guise is a powerful and intuitive tool designed specifically for developers to effortlessly create, manage, and
            apply themes across a multitude of applications. Whether you're a developer looking to unify your tool themes or a
            Linux ricing enthusiast striving for the perfect desktop aesthetic, Guise offers a powerful and elegant solution.
          </p>
          <blockquote>
            <p>Say goodbye to fragmented theming efforts and embrace a cohesive,</p>
            <footer>personalized development environment with Guise.</footer>
          </blockquote>
          <p>Stay tuned for release details and documentation to begin your journey with universal theming!</p>
        </section>
      </article>
    </div>
  );
}
