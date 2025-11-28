import { lazy, useEffect, type ComponentType } from "react";
import { createBrowserRouter, useLocation, type RouteObject } from "react-router";
import Layout from "./layout";
import ErrorBoundary from "./error";

export type Page = ComponentType<object>;

export type Metadata = {
  title: string;
  description: string;
  canonical: string;
};

const metadata = new Map<string, () => Promise<Metadata | undefined>>();

metadata.set("/", async () => {
  const module = (await import("./page.tsx")) as { metadata?: Metadata };
  return module.metadata;
});

const dynamicRoutes: RouteObject[] = [
  {
    index: true,
    Component: lazy(() => import("./page.tsx") as Promise<{ default: Page }>),
  },
];

function pathToRoute(path: string): string {
  let route = path.replace(/^\.\//, "");
  route = route.replace(/\/page\.tsx$/i, "");
  if (route === "page") {
    route = "";
  }
  return route.toLowerCase();
}

const pages = import.meta.glob("./**/page.tsx");

for (const path in pages) {
  const page = pages[path];
  const slug = pathToRoute(path);
  const canonical = `/${slug}`;

  metadata.set(canonical, async () => {
    const module = (await page()) as {
      default: Page;
      metadata?: Metadata;
    };
    return module.metadata;
  });

  const route: RouteObject = {
    path: slug,
    Component: lazy(() => page() as Promise<{ default: Page }>),
  };

  dynamicRoutes.push(route);
}

export const createRoute = createBrowserRouter(
  [
    {
      path: "/",
      Component: Layout,
      ErrorBoundary: ErrorBoundary,
      children: dynamicRoutes,
    },
  ],
  {
    basename: "/",
  },
);

export function useMetadata() {
  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    const page = metadata.get(currentPath);
    if (page) {
      page()
        .then((meta) => {
          createMetadata(
            meta || {
              title: "Missing Metadata",
              description: "Metadata not defined for this page.",
              canonical: currentPath,
            },
          );
        })
        .catch((error) => {
          console.error("Failed to load metadata:", error);
        });
    } else {
      createMetadata({
        title: "Not Found",
        description: "This page does not exist.",
        canonical: currentPath,
      });
    }
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
