import { useMetadata } from "./route";
import { StrictMode, type ComponentProps } from "react";
import { Outlet } from "react-router";
import Header from "../components/header";
import Footer from "../components/footer";

export default function Layout({ children }: ComponentProps<"div">) {
  useMetadata();

  return (
    <StrictMode>
      <Header />
      <main>
        {children}
        <Outlet />
      </main>
      <Footer />
    </StrictMode>
  );
}
