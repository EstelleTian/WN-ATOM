const path = require('path');
const webpackConfigBase = require("./webpack.base.config");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const WebpackMerge = require("webpack-merge");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')


const webpackConfigProd = {
    mode: "production",
    plugins:[
        new  CleanWebpackPlugin()
    ]
};
module.exports = WebpackMerge.merge(webpackConfigBase, webpackConfigProd);