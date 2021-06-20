/* eslint-disable */
const webpack = require("webpack");
const webpackMerge = require("webpack-merge");
const common = require("./webpack.common");

module.exports = webpackMerge(common, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    https: false,
    hot: true,
    inline: true,
    liveReload: true,
    host: "0.0.0.0",
    port: 3000,
    useLocalIp: true,
    compress: true,
    headers: {},
    proxy: {},
    before(app) {},
    after(app) {}
  },
  plugins: [new webpack.HotModuleReplacementPlugin()]
});
