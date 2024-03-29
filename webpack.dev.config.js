/*
 * @Author: your name
 * @Date: 2020-12-23 20:50:11
 * @LastEditTime: 2021-03-26 13:49:23
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-ATOM\webpack.dev.config.js
 */
/*
 * @file webpack配置文件(开发环境)
 * @author liutianjiao
 * @date 2020-12-25
 */
const path = require('path');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const webpackConfigBase = require("./webpack.base.config");
const WebpackMerge = require("webpack-merge");
const WebpackBar = require('webpackbar');
const webpack = require('webpack');
const port = 3033;

const webpackConfigDev = {
    devtool: 'inline-source-map',
    mode:'development',
    plugins: [
        new OpenBrowserPlugin({
            url: `http://localhost:${port}`
        }),
        // HMR
        new webpack.HotModuleReplacementPlugin(),
        new WebpackBar({
            color: '#0096f5',
            name: 'frontend',
        }),
    ],
    devServer: {
        compress: false, // 启用gzip压缩
        contentBase: path.join(__dirname, 'src'),
        port: port, // 运行端口3033
        inline: false,
        hot: true,
        host: '0.0.0.0',
        historyApiFallback: true,
    },

};

module.exports = WebpackMerge.merge(webpackConfigBase, webpackConfigDev);