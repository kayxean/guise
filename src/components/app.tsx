import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";

const css = stylex.create({
  layout: {
    margin: 0,
  },
  header: {
    padding: "1rem",
  },
  footer: {
    padding: "1rem",
  },
});

export default function App({ children, ...props }: ComponentProps<"div">) {
  const layout = stylex.props(css.layout);
  const header = stylex.props(css.header);
  const footer = stylex.props(css.footer);

  return (
    <div {...props} className={layout.className} style={layout.style}>
      <header>
        <div className={header.className} style={header.style}>
          <h1>Guise</h1>
        </div>
      </header>
      <main>{children}</main>
      <footer>
        <div className={footer.className} style={footer.style}>
          <p>{new Date().toLocaleDateString()}</p>
        </div>
      </footer>
    </div>
  );
}
