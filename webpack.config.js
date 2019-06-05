const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

const rendererConfig = {
  mode: 'development',
  entry: {
    index: path.resolve(__dirname, 'static/index.ts'),
    loading: path.resolve(__dirname, 'static/loading.ts'),
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
        options: {
          appendTsSuffixTo: [/\.vue$/i],
        },
      },
      {
        test: /\.vue$/i,
        loader: 'vue-loader',
      },
      {
        test: /\.js$/i,
        loader: 'babel-loader',
      },
    ],
  },
  resolve: {
    alias: {
      vue: 'vue/dist/vue.esm.js',
      src: path.join(__dirname, 'src'),
      static: path.join(__dirname, 'static'),
    },
    extensions: ['.js', '.ts', '.json'],
  },
  target: 'electron-renderer',
  plugins: [
    new VueLoaderPlugin()
  ]
}

const mainConfig = {
  mode: 'development',
  entry: {
    main: path.resolve(__dirname, 'src/main-process/main.ts'),
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
  resolve: {
    extensions: ['.js', '.ts', '.json'],
    alias: {
      src: path.join(__dirname, 'src'),
      static: path.join(__dirname, 'static'),
    },
  },
  target: 'electron-main',
}

module.exports = [ rendererConfig, mainConfig ]
