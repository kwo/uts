import process from "node:process";
import { build } from "esbuild";

const version = process.env.UTS_VERSION ?? "dev";
const commitHash = process.env.UTS_COMMIT_HASH ?? "unknown";
const commitTS = process.env.UTS_COMMIT_TS ?? "unknown";

await build({
  entryPoints: ["src/uts.ts"],
  bundle: true,
  platform: "node",
  format: "esm",
  outfile: "dist/uts",
  minify: true,
  define: {
    __VERSION__: JSON.stringify(version),
    __COMMIT_HASH__: JSON.stringify(commitHash),
    __COMMIT_TS__: JSON.stringify(commitTS),
  },
  banner: {
    js: '#!/usr/bin/env node\nimport { createRequire } from "node:module"; const require = createRequire(import.meta.url);',
  },
});
