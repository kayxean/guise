import { lazy, useEffect, type ComponentType } from "react";
import { createBrowserRouter, useMatches, type RouteObject } from "react-router";
import Layout from "./layout";
import ErrorBoundary from "./error";

export type Page = ComponentType<object>;

export type Metadata = {
  title: string;
  description: string;
  canonical: string;
};

type PageModule = {
  default: Page;
  metadata?: Metadata;
};

function convertPath(filePath: string): string {
  let routePath = filePath.replace(/^\.\//, "");
  routePath = routePath.replace(/\/page\.tsx$/i, "");
  routePath = routePath.replace(/\[(\w+)\]/g, ":$1");

  if (routePath === "page" || routePath === "") {
    routePath = "/";
  } else {
    routePath = `/${routePath}`;
  }

  return routePath.toLowerCase();
}

function generateDynamicRoutes(): RouteObject[] {
  const routes: RouteObject[] = [];

  const loadRootPageModule = () => import("./page.tsx") as Promise<PageModule>;
  const rootPageModulePromise = loadRootPageModule();

  const rootPageRoute: RouteObject = {
    index: true,
    Component: lazy(loadRootPageModule),
    handle: {
      metadata: rootPageModulePromise.then((module) => module.metadata),
    },
  };
  routes.push(rootPageRoute);

  const pageFiles = import.meta.glob<PageModule>("./**/page.tsx");

  for (const filePath in pageFiles) {
    if (filePath === "./page.tsx") {
      continue;
    }

    const loadPageModule = pageFiles[filePath];
    const routePath = convertPath(filePath);
    const pageModulePromise = loadPageModule();

    const route: RouteObject = {
      path: routePath,
      Component: lazy(() => pageModulePromise),
      handle: {
        metadata: pageModulePromise.then((module) => module.metadata),
      },
    };
    routes.push(route);
  }

  return routes;
}

const dynamicRoutes = generateDynamicRoutes();

export const appRouter = createBrowserRouter(
  [
    {
      path: "/",
      Component: Layout,
      ErrorBoundary: ErrorBoundary,
      children: dynamicRoutes,
    },
  ],
  { basename: "/" },
);

export function useMetadata() {
  const matches = useMatches();

  useEffect(() => {
    const currentMatch = matches.find((m) => Boolean((m.handle as { metadata?: Promise<Metadata | undefined> })?.metadata));

    const metadataPromise = (
      currentMatch?.handle as {
        metadata?: Promise<Metadata | undefined>;
      }
    )?.metadata;

    if (metadataPromise) {
      metadataPromise
        .then((meta) => {
          createMetadata(
            meta || {
              title: "Missing Metadata",
              description: "Metadata not defined for this page.",
              canonical: window.location.href,
            },
          );
        })
        .catch((error) => console.error("Failed to load metadata:", error));
    } else {
      createMetadata({
        title: "Page Not Found",
        description: "The page you are looking for does not exist.",
        canonical: window.location.href,
      });
    }
  }, [matches]);
}

export function createMetadata(pageMeta: Metadata) {
  document.title = pageMeta.title;

  let description = document.head.querySelector("meta[name='description']");
  if (!description) {
    description = document.createElement("meta");
    description.setAttribute("name", "description");
    document.head.appendChild(description);
  }
  description.setAttribute("content", pageMeta.description);

  let canonical = document.querySelector("link[rel='canonical']");
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    document.head.appendChild(canonical);
  }
  const currentBase = new URL(document.location.origin);
  const canonicalUrl = new URL(pageMeta.canonical, currentBase).href;
  canonical.setAttribute("href", canonicalUrl);
}
