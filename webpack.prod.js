const merge = require('webpack-merge')
const common = require('./webpack.common')

module.exports = [
  merge(common.rendererConfig, {
    mode: 'production',
  }),
  merge(common.mainConfig, {
    mode: 'production',
  }),
]