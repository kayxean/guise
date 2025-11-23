import * as stylex from "@stylexjs/stylex";
import { Link, Outlet } from "react-router";
import type { ComponentProps } from "react";

const styles = stylex.create({
  layout: {
    minHeight: "100vh",
  },
  header: {
    padding: "1rem",
  },
  footer: {
    padding: "1rem",
  },
});

export default function Layout({ children, ...props }: ComponentProps<"div">) {
  return (
    <div {...stylex.props(styles.layout)} {...props}>
      <header>
        <div {...stylex.props(styles.header)}>
          <nav>
            <ul>
              <li>
                <Link to="/">Guise</Link>
              </li>
              <li>
                <Link to="/typography">Typography</Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main>
        {children}
        <Outlet />
      </main>
      <footer>
        <div {...stylex.props(styles.footer)}>
          <p>{new Date().toLocaleDateString()}</p>
        </div>
      </footer>
    </div>
  );
}
