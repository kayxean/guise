import * as stylex from "@stylexjs/stylex";
import { createMetadata } from "~/app/route";
import { useRouteError, isRouteErrorResponse } from "react-router";

const styles = stylex.create({
  section: {
    padding: "1rem",
  },
});

export default function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    const status = `${error.status} ${error.statusText}`;
    const data = error.data;

    createMetadata({
      title: status,
      description: data.replace(/"/g, ""),
      canonical: "/error",
    });

    return (
      <div {...stylex.props(styles.section)}>
        <h1>{status}</h1>
        <p>{data}</p>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div {...stylex.props(styles.section)}>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
