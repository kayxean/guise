import "./style.css";
import * as stylex from "@stylexjs/stylex";
import { createRoute } from "./route";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router/dom";

const styles = stylex.create({
  layout: {
    padding: "0 0.875rem",
  },
});

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
  root.render(<RouterProvider router={createRoute} />);

  isRendered = true;
}
