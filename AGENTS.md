# AGENTS.md

This file provides guidance to AI agents when working with code in this repository.

## Project Overview

`uts` is a standalone TypeScript CLI tool that converts between Unix timestamps and human-readable dates. The build bundles the application into a single Node.js executable script.

The application entrypoint is `src/uts.ts`.

## Build and Development Commands

### Install dependencies
```sh
npm install
```

### Build the CLI
```sh
npm run build
```

This runs formatting checks, ESLint, TypeScript type-checking, bundles the CLI with esbuild, and marks `dist/uts` executable.

### Run locally
```sh
npm run dev -- [args]
```

### Linting
```sh
npm run lint
```

### Format source files
```sh
npm run lint:formatfix
```

## Architecture

### Core Design
The CLI uses a simple argument-based parser in `main()` that handles different input formats through pattern matching on argument count and length:

- **No args**: Print current Unix timestamp
- **1 arg, < 19 chars**: Parse as Unix timestamp → output RFC3339 date in local timezone
- **1 arg, 19 chars**: Parse as `YYYY-MM-DDTHH:MM:SS` in local timezone
- **1 arg, 20 or 25 chars**: Parse as RFC3339 with timezone (`Z` or `±HH:MM`)
- **2 args**: Parse as `YYYY-MM-DD HH:MM:SS` in local timezone
- **3 args, last 5-6 chars**: Parse with timezone offset (`±HH:MM`)
- **3 args, other**: Parse with named timezone (for example `Europe/Berlin`) using `Intl.DateTimeFormat`

### Build Configuration
- `scripts/build.mjs` bundles `src/uts.ts` with esbuild
- Build metadata is injected with `UTS_VERSION`, `UTS_COMMIT_HASH`, and `UTS_COMMIT_TS`
- The output file is `dist/uts` with a Node shebang
- Release packaging in `.github/workflows/release.yml` creates tar/zip archives for the existing distribution layout

### Key Constraints
1. **Single-file bundle**: Production builds should stay bundled into one executable script for Unix-like systems
2. **No runtime dependencies**: The CLI should rely on the Node.js standard library only at runtime
3. **Named timezone support**: Preserve parsing for IANA timezones such as `Europe/Berlin`

## Version Information
Version data is injected at build time and displayed with:
- `uts --version`: Shows version only
- `uts --version -v`: Shows extended version (version, commit hash, commit date, Node version)
