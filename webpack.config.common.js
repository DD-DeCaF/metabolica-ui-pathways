const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const merge = require('webpack-merge');
const webpackTest = require('./webpack.config.test');

module.exports = merge(webpackTest,{
    entry: {
        main: './src/index.js',
    },
    output: {
        filename: '[chunkhash].[name].js',
        path: path.resolve(__dirname, 'dist')
    },
    node: {
        fs: "empty",
        child_process: "empty"
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor', 'manifest'],
            minChunks: function (module) {
                return module.context
                    && module.context.indexOf('node_modules') !== -1
                    && module.context.indexOf('metabolica') === -1;
            }
        }),
        new ExtractTextPlugin('[chunkhash].[name].css'),
        new HtmlWebpackPlugin({
            inject: 'head',
            template: './src/index.html',
            filename: 'index.html'
        })
    ],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                include: [
                    path.resolve(__dirname, 'src'),
                    __dirname
                ]
            }
        ]
    }
});
