# Guise

This is a web-based creative space for designing how applications look and feel. Built with [Remix](https://remix.run/), [Vite+](https://viteplus.dev/), and [StyleX](https://stylexjs.com/), it provides a browser-like playground and a collection of [color tools](https://github.com/kayxean/chromatrix) to experiment with. More design environments are on the way.

> [!WARNING]
> **Work in Progress**
>
> This project is under active development. Features are subject to change, and you may encounter bugs or incomplete functionality.

## Development

| Command          | Description                                                                 |
| ---------------- | --------------------------------------------------------------------------- |
| `vp run dev`     | Starts the Remix development server with HMR and live reloading.            |
| `vp run build`   | Compiles the application for production, outputting to the `build/` folder. |
| `vp run preview` | Locally previews the production build to ensure deployment readiness.       |
| `vp check`       | Analyzes the codebase for errors and style issues using Oxlint.             |
| `vp check --fix` | Automatically fixes linting errors and formats code via Oxfmt.              |
