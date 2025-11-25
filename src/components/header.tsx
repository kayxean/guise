import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";
import { Link } from "react-router";

const styles = stylex.create({
  header: {
    position: "relative",
  },
  container: {
    padding: "1rem",
  },
});

export default function Header({ ...props }: ComponentProps<"header">) {
  return (
    <header {...props} {...stylex.props(styles.header)}>
      <div {...stylex.props(styles.container)}>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/typography">Typography</Link>
            </li>
            <li>
              <Link to="/404">404</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
