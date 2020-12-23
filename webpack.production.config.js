/*
 * @file webpack配置文件(产品环境)
 * @author liutianjiao
 * @date 2017-09-05
 */
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
//去掉console组件
const TerserPlugin = require('terser-webpack-plugin');
module.exports = {
    entry: {
        main: ['babel-polyfill', './app/router.jsx'],
        vendor: [
            'react',
            'react-dom',
            'jquery',
            'react-router',
            'redux',
            'react-router-dom',
            'react-redux',
            'axios',
        ]
    },
    output: {
        path: path.join(__dirname, '/build'),
        filename: '[name].[hash:5].js',
        chunkFilename: "js/[name].chunk.js" //给每个分片产生一个文件
    },
    resolve : {
        extensions: [".js", ".jsx", ".less", ".css", ".json"],
        alias:{
            utils: path.resolve(__dirname, 'src/utils'),
            components: path.resolve(__dirname, 'src/components'),
        }
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: 'babel-loader',
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
                                // modifyVars:{
                                //     "primary-color":"rgba(0, 0, 0, .7)",
                                //     "heading-color": "#fff",
                                //     "text-color": "#fff",
                                //     "text-color-secondary": "#fff",
                                //     "input-bg": "rgba(0, 0, 0, 0)",
                                //     "layout-body-background": "rgba(0, 0, 0, 0)",
                                //     "layout-header-background ": "rgba(0, 0, 0, 0)",
                                //     "layout-sider-background-light": "rgba(0, 0, 0, 0)",
                                //     "component-background": "rgba(0, 0, 0, 0)",
                                //     "border-color-split ": "rgba(255,255,255,.125)",
                                // }
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
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: ['vendor'],
            minChunks: Infinity,
            filename: 'common.bundle.[chunkhash].js',
        }),
        new webpack.optimize.CommonsChunkPlugin({
            names: ['manifest'],
            filename: 'manifest.bundle.[chunkhash].js',
        }),
        new webpack.HashedModuleIdsPlugin(),
        new HtmlWebpackPlugin({
            //根据模板插入css/js等生成最终HTML
            title: '空中交通运行放行监控系统',//根据模板插入css/js等生成最终HTML
            filename:'index.html',    //生成的html存放路径，相对于 path
            // template:'./app/index.html',    //html模板路径
            // favicon: './app/favicon.ico',
            cache: false,
            inject:true,    //允许插件修改哪些内容，包括head与body
            // hash:true,    //为静态资源生成hash值
            minify:{    //压缩HTML文件
                removeComments:true,    //移除HTML中的注释
                collapseWhitespace:false    //删除空白符与换行符
            }
        }),
        new ExtractTextPlugin({
            filename: 'css/[name][hash:8].css',
            allChunks: true
        }),
    ],
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    chunks: 'initial',
                    minChunks: 2,
                    maxInitialRequests: 5,
                    minSize: 0
                },
                vendor: {
                    test: /node_modules/,
                    chunks: 'initial',
                    name: 'vendor',
                    priority: 10,
                    enforce: true
                }
            }
        },
        minimizer: [
            new TerserPlugin({
                minify: (file, sourceMap) => {
                    // https://github.com/mishoo/UglifyJS2#minify-options
                    const uglifyJsOptions = {
                        /* your `uglify-js` package options */
                        compress: {
                            drop_console: true
                        }
                    };

                    if (sourceMap) {
                        uglifyJsOptions.sourceMap = {
                            content: sourceMap,
                        };
                    }

                    return require('uglify-js').minify(file, uglifyJsOptions);
                },
            }),
        ],

    }
}
