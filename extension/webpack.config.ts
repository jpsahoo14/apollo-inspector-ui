import path from "path";
import CopyPlugin from "copy-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";
import webpack from "webpack";

const plugins = [
  new CopyPlugin({
    patterns: [
      {
        from: "./extension/panel/panel.html",
        to: path.resolve(__dirname, "../build/extension"),
      },
      {
        from: "./extension/devtools/devtools.html",
        to: path.resolve(__dirname, "../build/extension"),
      },
      {
        from: "./extension/manifest.json",
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
      ["content-script"]: "./extension/content-script/content-script.ts",
      background: "./extension/background/background.ts",
      devtools: "./extension/devtools/devtools.ts",
      panel: "./extension/panel/panel.tsx",
      webpage: "./extension/web-page/web-page-script.ts",
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
