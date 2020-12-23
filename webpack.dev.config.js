/*
 * @file webpack配置文件(开发环境)
 * @author liutianjiao
 * @date 2017-09-05
 */
const path = require('path');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpackConfigBase = require("./webpack.base.config");
const WebpackMerge = require("webpack-merge");

const port = 3033;

const webpackConfigDev = {
    devtool: 'cheap-module-eval-source-map',
    mode:'development',
    plugins: [
        new OpenBrowserPlugin({
            url: `http://localhost:${port}`
        }),
        new ExtractTextPlugin({
            filename: 'css/[name][hash:8].css',
            allChunks: true
        }),
    ],
    devServer: {
        compress: false, // 启用gzip压缩
        contentBase: path.join(__dirname, 'src'),
        port: port, // 运行端口3000
        inline: true,
        hot: true,
        host: '0.0.0.0',
        historyApiFallback: true,
    },

};

module.exports = WebpackMerge.merge(webpackConfigBase, webpackConfigDev);