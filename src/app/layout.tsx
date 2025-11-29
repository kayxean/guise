import { useMetadata } from "./route";
import { Outlet } from "react-router";
import Header from "~/components/header";
import Footer from "~/components/footer";

export default function Layout() {
  useMetadata();

  return (
    <div>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
