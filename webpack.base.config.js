/*
 * @file webpack配置文件
 * @author liutianjiao
 * @date 2020-12-25
 */
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const { getThemeVariables } = require('antd/dist/theme');

module.exports = {
    entry: {
        bundle: './src/app.jsx',
        vendor: ['react', 'react-dom', 'jquery', 'react-router', 'redux'],
    },
    output: {
        path: path.join(__dirname, '/build'),
        filename: '[name].[hash:5].js',
        chunkFilename: "js/[name].chunk.js" //给每个分片产生一个文件
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,// 排除不处理的目录
                use: [{
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true, // 缓存loader执行结果 发现打包速度已经明显提升了
                    }
                }]
            },
            {
                test: /\.(css|less)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader:'css-loader'
                    },
                    {
                        loader:'postcss-loader'
                    },
                    {
                        loader:'less-loader',
                        options: {

                            javascriptEnabled: true,

                        }
                    }
                ]
            },
            {
                test: /\.scss/,
                use: [
                    'css-hot-loader',
                    MiniCssExtractPlugin.loader,
                    {
                        loader:'css-loader'
                    },
                    {
                        loader:'sass-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'sass-resources-loader',
                        options: {
                            resources: ['./src/style/common.scss', './src/style/button.scss']
                        }
                    }
                ]
            },
            {
                test: /\.(eot|woff|eot|ttf|svg)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 999999999999999,  //这里要足够大这样所有的字体图标都会打包到css中
                    }
                }
            },
            {
                test: /\.jpg|png$/,
                use: ['url-loader']
            }
        ]
    },
    resolve : {
        extensions: [".js", ".jsx", ".less", ".css", ".json"],
        alias:{
            utils: path.resolve(__dirname, 'src/utils'),
            components: path.resolve(__dirname, 'src/components'),
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: __dirname + '/src/index.html',
            inject: 'body',
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
            }
        }),
        new MiniCssExtractPlugin({
            filename: 'css/[name][hash:8].css',
            // chunkFilename: "css/[hash:8].css"
        }),
        // moment 只打包 cn locale
        new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn/),
    ],
    optimization: {
        splitChunks: {
            cacheGroups: { //缓存策略，默认设置了分割node_modules和公用模块
                common: {// ‘src/js’ 下的js文件
                    chunks:"all",
                    test:/[\\/]src[\\/].*\.js/,//也可以值文件/[\\/]src[\\/]js[\\/].*\.js/,
                    name: "common", //生成文件名，依据output规则
                    minChunks: 2,
                    maxInitialRequests: 5,
                    minSize: 0,
                    priority:1
                },
                vendors: {
                    chunks:"initial",
                    test: path.resolve(process.cwd(), "node_modules"),
                    name:"vendor",
                    enforce: true
                }
            }
        }
    }
};