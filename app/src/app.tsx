import { createRoot } from "react-dom/client";
import { Layout, Header, Main, Footer, Button } from "@guise/ui";
import { helloWorld } from "@guise/theme";

function App() {
  return (
    <Layout>
      <Header>
        <h1>Guise</h1>
      </Header>
      <Main>
        <div>
          <span>Test</span>
          <Button onClick={() => console.log(helloWorld)}>Click me</Button>
        </div>
      </Main>
      <Footer>
        <p>{new Date().toLocaleString()}</p>
      </Footer>
    </Layout>
  );
}

const root = document.body;

if (root) {
  createRoot(root).render(<App />);
}
