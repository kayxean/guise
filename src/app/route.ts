import { useEffect } from "react";
import { createBrowserRouter, useLocation } from "react-router";
import Layout from "./layout";
import Home from "./page";
import About from "./about/page";
import Typography from "./typograpy/page";
import ErrorBoundary from "~/components/error-boundary";

export const createRoute = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    ErrorBoundary: ErrorBoundary,
    children: [
      { index: true, Component: Home },
      { path: "about", Component: About },
      { path: "typography", Component: Typography },
    ],
  },
]);

export type Metadata = {
  title: string;
  description: string;
  canonical: string;
};

export const metadata: Metadata[] = [
  {
    title: "Guise: Mask and Theme",
    description: "implies masking or theming the underlying tool",
    canonical: "/",
  },
  {
    title: "Guise: About",
    description: "about guise",
    canonical: "/about",
  },
  {
    title: "Guise: Typography",
    description: "typography demo",
    canonical: "/typography",
  },
];

export function useMetadata() {
  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    const meta: Metadata | undefined = metadata.find((item) => item.canonical === currentPath);

    createMetadata(
      meta || {
        title: "Not Found",
        description: "This page does not exist.",
        canonical: currentPath,
      },
    );
  }, [currentPath]);
}

export function createMetadata(page: Metadata) {
  document.title = page.title;

  let description = document.head.querySelector('meta[name="description"]');
  if (!description) {
    description = document.createElement("meta");
    description.setAttribute("name", "description");
    document.head.appendChild(description);
  }
  description.setAttribute("content", page.description);

  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    document.head.appendChild(canonical);
  }
  canonical.setAttribute("href", new URL(document.location.href).href);
}
