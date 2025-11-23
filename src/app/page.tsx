import * as stylex from "@stylexjs/stylex";

const styles = stylex.create({
  section: {
    padding: "0 1rem",
  },
});

export default function Home() {
  return (
    <div {...stylex.props(styles.section)}>
      <h1>Home</h1>
    </div>
  );
}
