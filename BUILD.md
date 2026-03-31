# Build and Release Maintenance

This document covers the tagged release workflow and the manual Homebrew/Linuxbrew tap update process for `uts`.

## Release workflow

Official releases are created by pushing semantic version tags from Git.

Example:

```bash
git tag v1.2.3
git push origin v1.2.3
```

The GitHub Actions release workflow publishes archives with this naming pattern:

- `uts_v<version>_darwin_amd64.tar.gz`
- `uts_v<version>_darwin_arm64.tar.gz`
- `uts_v<version>_linux_amd64.tar.gz`
- `uts_v<version>_linux_arm64.tar.gz`
- `uts_v<version>_windows_amd64.zip`
- `uts_v<version>_windows_arm64.zip`
- `SHA256SUMS`

Archive layout is binary-only:

- macOS/Linux archives extract a single `uts` binary at the archive root
- Windows archives extract a single `uts.exe` binary at the archive root

## Generate the Homebrew formula

From this repository, generate a ready-to-commit `uts.rb` formula on stdout.

Latest stable release:

```bash
scripts/homebrew-formula
```

Specific tag:

```bash
scripts/homebrew-formula --tag v1.2.3
```

The script:

- uses `gh release list` to select the latest published non-draft, non-prerelease release by default
- uses `gh release view` to inspect release assets
- downloads and parses the release `SHA256SUMS`
- fails if `gh` is missing, unusable, or the release is missing required assets

## Update the tap

Tap repository:

- `kwo/homebrew-tools`

Tap command for users:

```bash
brew tap kwo/tools
```

Manual update flow:

1. Cut and publish the `uts` GitHub release.
2. Generate the formula from this repo:
   ```bash
   scripts/homebrew-formula --tag v1.2.3 > ../homebrew-tools/uts.rb
   ```
3. Review the generated formula in `../homebrew-tools/uts.rb`.
4. Commit and push the tap update from `kwo/homebrew-tools`.

User install command after the tap contains the formula:

```bash
brew install kwo/tools/uts
```
