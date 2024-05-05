import path from "path";
import CopyPlugin from "copy-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";
import webpack from "webpack";

const plugins = [
  new CopyPlugin({
    patterns: [
      {
        from: "./extension/src/panel/panel.html",
        to: path.resolve(__dirname, "../build/extension"),
      },
      {
        from: "./extension/src/devtools/devtools.html",
        to: path.resolve(__dirname, "../build/extension"),
      },
      {
        from: "./extension/manifest.json",
        to: path.resolve(__dirname, "../build/extension"),
      },
      {
        from: "./extension/images/brand-icon/icon16.png",
        to: path.resolve(__dirname, "../build/extension"),
      },
      {
        from: "./extension/images/brand-icon/icon32.png",
        to: path.resolve(__dirname, "../build/extension"),
      },
      {
        from: "./extension/images/brand-icon/icon48.png",
        to: path.resolve(__dirname, "../build/extension"),
      },
      {
        from: "./extension/images/brand-icon/icon128.png",
        to: path.resolve(__dirname, "../build/extension"),
      },
    ],
  }),
];

export default (env: any): webpack.Configuration => {
  const devOptions =
    env.NODE_ENV === "development"
      ? {
          devtool: "inline-source-map",
        }
      : {};
  return {
    ...devOptions,
    mode: env.NODE_ENV,
    entry: {
      ["content-script"]: "./extension/src/content-script/content-script.ts",
      background: "./extension/src/background/background.ts",
      devtools: "./extension/src/devtools/devtools.ts",
      panel: "./extension/src/panel/panel.tsx",
      webpage: "./extension/src/web-page/web-page-script.ts",
    },
    output: {
      path: path.join(__dirname, "../build/extension"),
      filename: "[name].js",
    },
    resolve: {
      extensions: [".js", ".ts", ".tsx", ".css"],
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx|tsx|ts)$/,
          loader: "babel-loader",
        },
      ],
    },
    optimization: {
      minimize: env.NODE_ENV === "production",
      minimizer: [
        (compiler) => {
          new TerserPlugin({
            terserOptions: {
              output: {
                comments: false,
              },
            },
          }).apply(compiler);
        },
      ],
    },
    plugins,
  };
};
