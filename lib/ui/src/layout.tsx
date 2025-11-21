import * as stylex from "@stylexjs/stylex";
import type { CSSProperties, JSX, ReactNode } from "react";

const styles = stylex.create({
  layout: {
    margin: 0,
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "1rem",
  },
  main: {
    padding: "1rem",
  },
  footer: {
    padding: "1rem",
  },
});

interface Props {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

const Layout = ({ children, style, ...props }: Props): JSX.Element => {
  const { className, style: layoutStyle } = stylex.props(styles.layout);
  return (
    <div {...props} className={className} style={layoutStyle}>
      {children}
    </div>
  );
};

const Header = ({ children, style, ...props }: Props): JSX.Element => {
  const { className, style: headerStyle } = stylex.props(styles.header);
  return (
    <header {...props} className={className} style={headerStyle}>
      {children}
    </header>
  );
};

const Main = ({ children, style, ...props }: Props): JSX.Element => {
  const { className, style: mainStyle } = stylex.props(styles.main);
  return (
    <main {...props} className={className} style={mainStyle}>
      {children}
    </main>
  );
};

const Footer = ({ children, style, ...props }: Props): JSX.Element => {
  const { className, style: footerStyle } = stylex.props(styles.footer);
  return (
    <footer {...props} className={className} style={footerStyle}>
      {children}
    </footer>
  );
};

export { Layout, Header, Main, Footer };
