import "./style.css";
import { createRoute, type Metadata } from "./route";
import { createRoot } from "react-dom/client";
import { Suspense } from "react";
import { RouterProvider } from "react-router/dom";
import * as stylex from "@stylexjs/stylex";

const styles = stylex.create({
  layout: {
    padding: "0 0.875rem",
  },
});

export const metadata: Metadata = {
  title: "Guise: Mask and Theme",
  description: "implies masking or theming the underlying tool",
  canonical: "/",
};

export default function Home() {
  return (
    <div {...stylex.props(styles.layout)}>
      <h1>Home</h1>
    </div>
  );
}

let isRendered = false;
if (!isRendered) {
  const root = createRoot(document.getElementById("root") || document.body);
  root.render(
    <Suspense fallback={<div>Loading Page...</div>}>
      <RouterProvider router={createRoute} />
    </Suspense>,
  );

  isRendered = true;
}
