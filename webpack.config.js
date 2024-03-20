const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ExtensionReloader = require("webpack-extension-reloader");

const config = {
context: __dirname + '/src',
    entry: {
    background: "./background.js",
    execute: "./execute.js",
    timer: "./timer.js",
  },
  output: {
    path: __dirname + "/dist",
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      global: "window",
    }),
    new ExtensionReloader(),
    new CopyWebpackPlugin({
      patterns: [
        // { from: "timer.js", to: "timer.js" },
        // { from: "background.js", to: "background.js" },
        // { from: "execute.js", to: "execute.js" },
        { from: "icons", to: "icons" },
        { from: "index.html", to: "index.html" },
        {
          from: "manifest.json",
          to: "manifest.json",
        },
      ],
    }),
  ],
};

module.exports = config;
