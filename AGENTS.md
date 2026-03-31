# AGENTS.md

This file provides guidance to AI agents when working with code in this repository.

## Project Overview

`uts` is a standalone Go CLI tool that converts between Unix timestamps and human-readable dates. It compiles to a static binary with an embedded timezone database (via the `timetzdata` build tag), making it dependency-free and suitable for minimal installations.

The entire application is contained in a single file: `main.go` (~130 lines).

## Build and Development Commands

### Building the binary
```sh
go build -tags timetzdata
```

The `timetzdata` tag embeds the timezone database into the binary, eliminating the need for external timezone data files.

### Running locally
```sh
go run -tags timetzdata main.go [args]
```

### Linting
```sh
golangci-lint run
```

The project uses a comprehensive set of linters configured in `.golangci.yml`, including security checks (gosec), style checks (gofumpt, stylecheck), and error handling validation.

### Vulnerability checking
```sh
govulncheck -test .
```

## Architecture

### Core Design
The application uses a simple argument-based parser in `main()` that handles different input formats through pattern matching on argument count and length:

- **No args**: Print current Unix timestamp
- **1 arg, < 19 chars**: Parse as Unix timestamp → output RFC3339 date
- **1 arg, 19 chars**: Parse as `YYYY-MM-DDTHH:MM:SS` in local timezone
- **1 arg, 20 or 25 chars**: Parse as RFC3339 with timezone (Z or ±HH:MM)
- **2 args**: Parse as `YYYY-MM-DD HH:MM:SS` in local timezone
- **3 args, last 5-6 chars**: Parse with timezone offset (±HH:MM)
- **3 args, other**: Parse with named timezone (e.g., Europe/Berlin)

### Build Configuration
The `.goreleaser.yaml` defines:
- Cross-platform builds (darwin, linux, windows) for amd64 and arm64
- Build tags: `osusergo`, `netgo`, `timetzdata` for static compilation
- Version injection via ldflags to populate `version`, `commithash`, and `commitTS` variables
- Pre-release hooks: `go mod tidy`, `go generate`, linting, and vulnerability checks
- Homebrew tap automation for macOS installation

### Key Constraints
1. **Static binary requirement**: Must use `CGO_ENABLED=0` and appropriate build tags to ensure no external dependencies
2. **Embedded timezone data**: The `timetzdata` tag is critical for supporting named timezones without requiring system timezone files
3. **No external dependencies**: `go.mod` contains only the standard library (go 1.21.1)

## Version Information
Version data is injected at build time via ldflags and displayed with:
- `uts --version`: Shows version only
- `uts --version -v`: Shows extended version (version, commit hash, commit date, Go version)
