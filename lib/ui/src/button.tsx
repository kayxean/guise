import * as stylex from "@stylexjs/stylex";
import type React from "react";

const styles = stylex.create({
  base: {
    appearance: "none",
    borderWidth: 0,
    borderStyle: "none",
    backgroundColor: {
      default: "blue",
      ":hover": "darkblue",
    },
    color: "white",
    padding: "10px 20px",
    borderRadius: 4,
    cursor: "pointer",
    fontSize: 16,
  },
});

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const Button = ({ children, style, ...props }: ButtonProps) => {
  const { className, style: stylexStyle } = stylex.props(styles.base);
  return (
    <button {...props} className={className} style={{ ...stylexStyle, ...style }}>
      {children}
    </button>
  );
};
