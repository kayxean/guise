import "./assets/style.css";
import { createRoot } from "react-dom/client";
import App from "./components/app";

function Guise() {
  return (
    <App>
      <p>Hello world!</p>
    </App>
  );
}

createRoot(document.getElementById("root") || document.body).render(<Guise />);
