import type { Metadata } from "./route";
import { Article } from "~/components/semantic";

export const metadata: Metadata = {
  title: "Guise: Mask and Theme",
  description: "implies masking or theming the underlying tool",
  canonical: "/",
};

export default function Home() {
  return (
    <Article>
      <h1>Home</h1>
    </Article>
  );
}
