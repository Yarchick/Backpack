/* eslint-disable */
const Webpack = require("webpack");
const WebpackMerge = require("webpack-merge");
const common = require("./webpack.common");

module.exports = WebpackMerge(common, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    https: false,
    hot: false,
    inline: false,
    liveReload: false,
    host: "0.0.0.0",
    port: 3000,
    useLocalIp: true,
    compress: true,
    headers: {},
    proxy: {},
    before(app) {},
    after(app) {}
  },
  plugins: [new Webpack.HotModuleReplacementPlugin()]
});
