const path = require('path')

const rendererConfig = {
  mode: 'development',
  entry: {
    index: path.resolve(__dirname, 'script/index.js'),
    loading: path.resolve(__dirname, 'script/loading.js'),
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.ts$/i,
        loader: 'ts-loader',
      },
    ],
  },
  target: 'electron-renderer'
}

const mainConfig = {
  mode: 'development',
  entry: {
    main: path.resolve(__dirname, 'script/main.js'),
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.ts$/i,
        loader: 'ts-loader',
      },
    ]
  },
  target: 'electron-main',
}

module.exports = [ rendererConfig, mainConfig ]
