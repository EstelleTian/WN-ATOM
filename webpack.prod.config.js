const webpackConfigBase = require("./webpack.base.config");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TerserWebpackPlugin = require('terser-webpack-plugin')
const WebpackMerge = require("webpack-merge");

const webpackConfigProd = {
    mode: "production",
    plugins:[
        new CleanWebpackPlugin()
    ],
    optimization: {
        minimizer: [
            new TerserWebpackPlugin({
                sourceMap: true, // Must be set to true if using source-maps in production
                terserOptions: {
                    compress: {
                        drop_console: true,
                    },
                },
            }),
        ],
    }
}
module.exports = WebpackMerge.merge(webpackConfigBase, webpackConfigProd);