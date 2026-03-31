# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

VS Code extension that automatically hides the panel (terminal, output, problems) when the user switches to an editor tab. Solves the "half-height panel" problem where VS Code minimizes the panel instead of hiding it completely.

Single-file extension: all logic is in `src/extension.ts`. Activates on `onStartupFinished`, listens for `onDidChangeActiveTextEditor`, and hides the panel via two sequential VS Code commands (`toggleMaximizedPanel` then `closePanel`).

## Build & Development Commands

Package manager: **pnpm**

```bash
pnpm install                # install dependencies
pnpm run compile            # type-check + lint + build (esbuild)
pnpm run watch              # watch mode (esbuild + tsc in parallel)
pnpm run check-types        # TypeScript type-checking only
pnpm run lint               # ESLint on src/
pnpm run package            # production build (type-check + lint + minified esbuild)
pnpm run vsce:package       # create .vsix package
pnpm run vsce:publish       # publish to VS Marketplace
```

To test the extension: press F5 in VS Code (uses `.vscode/launch.json` to launch an Extension Development Host).

## Build System

esbuild bundles `src/extension.ts` → `dist/extension.js` (CJS, Node platform, `vscode` externalized). Config in `esbuild.js`.

## Release Process

Push a `v*` tag to trigger the GitHub Actions release workflow (`.github/workflows/release.yml`), which publishes to both VS Marketplace and Open VSX, and creates a GitHub Release with the `.vsix` artifact. Requires `VSCE_PAT` and `OVSX_PAT` secrets.
