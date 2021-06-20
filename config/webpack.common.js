/* eslint-disable */
const path = require("path");
const Webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    app: path.resolve(__dirname, "../src/app.ts")
  },
  output: {
    filename: "js/game0.1.js",
    path: path.resolve(__dirname, "../build")
  },
  module: {
    rules: [
      {
        test: /\.html$/i,
        use: ["html-loader"]
      },
      {
        test: /\.ts?$/,
        use: ["ts-loader"]
      },
      {
        test: /\.scss$/i,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              url: false
            }
          },
          "sass-loader"
        ]
      },
      {
        test: /\.(png|svg|jpe?g|gif)$/,
        use: ["file-loader"]
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../public/index.html"),
      filename: "index.html"
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: "public/assets", to: "assets" }]
    }),
    new Webpack.ProvidePlugin({
      PIXI: "pixi.js"
    })
  ]
};
