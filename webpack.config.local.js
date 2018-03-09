const path = require('path');
const merge = require('webpack-merge');
const webpackCommon = require('./webpack.config.common');
const local = {
    devtool: 'source-map',
    devServer: {
        historyApiFallback: true,
        proxy: {
            '/api': {
                // Set the following line to the address of the API you want to test against:
                target: 'https://iloop-staging.dd-decaf.eu',
                secure: false,
                changeOrigin: true
            }
        }
    }
}

module.exports = merge(webpackCommon, local);
