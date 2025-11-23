import "../app/style.css";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import Layout from "./layout";
import Home from "./page";
import Typography from "./typograpy/page";

const root = createRoot(document.getElementById("root") || document.body);

root.render(
  <BrowserRouter>
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="typography" element={<Typography />} />
      </Route>
    </Routes>
  </BrowserRouter>,
);
