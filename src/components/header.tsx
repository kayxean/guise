import type { ComponentProps } from "react";
import { Link } from "react-router";
import * as stylex from "@stylexjs/stylex";

const styles = stylex.create({
  header: {
    backgroundColor: "#060708",
    padding: "0 0.875rem",
    position: "sticky",
    top: 0,
    zIndex: 69,
  },
  nav: {
    alignItems: "center",
    display: "flex",
    gap: "1rem",
    height: "3.5rem",
  },
  brand: {
    alignItems: "center",
    color: "#f2f3f4",
    display: "inline-flex",
    textDecoration: "none",
  },
  logo: {
    width: "2rem",
    height: "2rem",
  },
  name: {
    fontSize: "1.5rem",
    fontWeight: 500,
    lineHeight: "2rem",
    marginLeft: "0.5rem",
  },
  list: {
    display: "flex",
    listStyle: "none",
  },
  item: {
    alignItems: "center",
    display: "inline-flex",
  },
  link: {
    backgroundColor: {
      default: "inherit",
      ":hover": "#202122",
    },
    borderRadius: "1rem",
    color: {
      default: "#c2c3c4",
      ":hover": "#f2f3f4",
    },
    fontSize: "0.875rem",
    lineHeight: "2rem",
    padding: "0 0.75rem",
    textDecoration: "none",
  },
});

export default function Header({ ...props }: ComponentProps<"header">) {
  return (
    <header {...props} {...stylex.props(styles.header)}>
      <nav {...stylex.props(styles.nav)}>
        <SiteLogo />
        <SiteLinks />
      </nav>
    </header>
  );
}

function SiteLogo() {
  return (
    <Link to="/" {...stylex.props(styles.brand)}>
      <svg {...stylex.props(styles.logo)} width={32} height={32} fill="none" viewBox="0 0 32 32">
        <path
          d="M16 6C21.9812 6 27.3144 8.80884 30.7869 13.1953C30.9266 13.3718 31 13.5923 31 13.8185C31 14.9804 28.6591 15.5669 27.9057 14.6911C25.0113 11.3264 20.7509 9.2 16 9.2C11.2491 9.2 6.98867 11.3264 4.09432 14.6911C3.34091 15.5669 1 14.9804 1 13.8185C1 13.5923 1.07339 13.3718 1.2131 13.1953C4.68557 8.80884 10.0188 6 16 6Z"
          fill="currentColor"
        />
        <path
          d="M23.1053 19.8C23.1053 19.2477 23.5471 18.8 24.0921 18.8H30.0132C30.5582 18.8 31 19.2477 31 19.8V21C31 21.5523 30.5582 22 30.0132 22H24.0921C23.5471 22 23.1053 21.5523 23.1053 21V19.8Z"
          fill="currentColor"
        />
        <path
          d="M8.89474 19.8C8.89474 19.2477 9.33656 18.8 9.88158 18.8H15.8026C16.3476 18.8 16.7895 19.2477 16.7895 19.8V21C16.7895 21.5523 16.3476 22 15.8026 22H9.88158C9.33656 22 8.89474 21.5523 8.89474 21V19.8Z"
          fill="currentColor"
        />
      </svg>
      <span {...stylex.props(styles.name)}>Guise</span>
    </Link>
  );
}

function SiteLinks() {
  return (
    <ul {...stylex.props(styles.list)}>
      <SiteLink path="/about" text="About" />
      <SiteLink path="/typography" text="Typography" />
      <SiteLink path="/pricing" text="Pricing" />
    </ul>
  );
}

function SiteLink({ path, text }: { path: string; text: string }) {
  return (
    <li {...stylex.props(styles.item)}>
      <Link to={path} {...stylex.props(styles.link)}>
        {text}
      </Link>
    </li>
  );
}
