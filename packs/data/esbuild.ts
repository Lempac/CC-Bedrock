import * as esbuild from "esbuild";
const scriptName = "main";
const IS_PRODUCTION_BUILD = false;
await esbuild.build({
  entryPoints: ["./data/src/main.ts"],
  outfile: `BP/scripts/${scriptName}.js`,
  bundle: true,
  format: "esm",
  external: [
    // "@minecraft/common",
    // "@minecraft/debug-utilities",
    "@minecraft/server",
    "@minecraft/server-ui",
    // "@minecraft/server-gametest"
  ],
  dropLabels: IS_PRODUCTION_BUILD ? ["DEBUG"] : [],
  minify: true,
  sourcemap: false,
});
// ensureDirSync(join(ROOT_DIR, "debug"));
// Deno.copyFileSync(`BP/scripts/${scriptName}.js`, join(ROOT_DIR, "debug", `${scriptName}.js`));
// Deno.copyFileSync(`BP/scripts/${scriptName}.js.map`, join(ROOT_DIR, "debug", `${scriptName}.js.map`));
