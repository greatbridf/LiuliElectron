const merge = require('webpack-merge')
const common = require('./webpack.common')

module.exports = [
  merge(common.rendererConfig, {
    mode: 'development',
    devtool: 'inline-source-map',
  }),
  merge(common.mainConfig, {
    mode: 'development',
    devtool: 'inline-source-map',
  }),
]