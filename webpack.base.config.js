const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')

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
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
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
                }),
            },
            {
                test: /\.scss/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader:'css-loader'
                        },
                        {
                            loader:'postcss-loader'
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
                                resources: ['./src/common.scss']
                            }
                        }
                    ]
                }),
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
            inject: 'body'
        }),
        new ExtractTextPlugin({
            filename: 'css/[name][hash:8].css',
            allChunks: true
        }),
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
        },
        // minimizer: [
        //     new UglifyJSPlugin({
        //         uglifyOptions: {
        //             sourceMap: true,
        //             compress: {
        //                 drop_console: true,
        //                 conditionals: true,
        //                 unused: true,
        //                 comparisons: true,
        //                 dead_code: true,
        //                 if_return: true,
        //                 join_vars: true,
        //                 warnings: false
        //             },
        //             output: {
        //                 comments: false
        //             }
        //         }
        //     })
        // ]
    }
};