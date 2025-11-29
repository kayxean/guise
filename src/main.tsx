import "./app/style.css";
import { appRouter } from "./app/route";
import { createRoot } from "react-dom/client";
import { StrictMode, Suspense } from "react";
import { RouterProvider } from "react-router";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element with ID 'root' not found in the DOM.");
}

const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <Suspense fallback={<div>Loading application...</div>}>
      <RouterProvider router={appRouter} />
    </Suspense>
  </StrictMode>,
);
