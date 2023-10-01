const esbuild = require("esbuild");
const process = require("process");
const { nodeExternalsPlugin } = require("esbuild-node-externals");
const pkg = require("../package.json");

function start(myProcess) {
  // console.log({ process, myProcess });
  const isDevBuild = isDevlopmentBuild();
  (async () => {
    return [
      esbuild.buildSync({
        entryPoints: ["index.ts"],
        format: "esm",
        write: true,
        bundle: true,
        minify: false,
        sourcemap: true,
        external: [...Object.keys(pkg.peerDependencies || {})],
        outfile: "dist/module.js",
        platform: "browser",
      }),
      esbuild.buildSync({
        entryPoints: ["index.ts"],
        format: "cjs",
        write: true,
        bundle: true,
        minify: false,
        sourcemap: true,
        external: [...Object.keys(pkg.peerDependencies || {})],
        outfile: "dist/main.js",
        platform: "browser",
      }),
    ];
  })();
}

function isDevlopmentBuild() {
  let isDevBuild = false;
  process.argv.forEach((val) => {
    if (val === "--dev") {
      isDevBuild = true;
    }
  });

  return isDevBuild;
}
start();
