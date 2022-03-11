const
  path = require('path'),
  fs = require('fs'),
  argv = require('minimist')(process.argv.slice(2)),
  federationConfig = require('./federation.config')


const
  webpack = require('webpack'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  TerserPlugin = require('terser-webpack-plugin'),
  { ModuleFederationPlugin } = require('webpack').container,
  { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer'),
  { presets, plugins } = require('./babel.config')


const // constans
  NODE_ENV = process.env.NODE_ENV ?? 'development',
  __isDEV__ = NODE_ENV === 'development',
  __isProd__ = NODE_ENV === 'production'

const
  root = path.resolve(__dirname, '../'),
  html = path.resolve(root, 'src', 'public', 'index.html')


/** @type {import('webpack').Configuration} */
const config = {
  context: root,
  entry: path.resolve(root, 'src/view/index.js'),
  bail: true,
  mode: NODE_ENV,
  devtool: !__isProd__ && 'source-map',
  output: {
    clean: true,
    path: path.resolve(root, 'dist'),
    uniqueName: path.basename(root),
    library: {
      type: 'umd'
    }
  },
  devServer: {
    hot: true,
    port: federationConfig.port,
  },

  resolve: {
    alias: {
      '~': root,
      '@pages': path.resolve(root, 'src', 'view', 'pages'),
      '@components': path.resolve(root, 'src', 'view', 'components'),
      '@HOC': path.resolve(root, 'src', 'view', 'HOC'),
    }
  },
  optimization: {
    splitChunks: {
      chunks: 'async',
      // cacheGroups: {
      //   commons: {
      //     chunks: 'all',
      //     name: "vendors",
      //     test: /[\\/]node_modules[\\/]/,
      //     priority: -10,
      //     reuseExistingChunk: true,
      //   },
      // }
    },
    minimize: __isProd__,
    minimizer: [
      new TerserPlugin({
        parallel: true, // muti-process 
        extractComments: __isProd__,
      }),
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: html,
      cache: true,
      ...__isProd__ && {
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
        },
      }
    }),
    new ModuleFederationPlugin({
      name: federationConfig.name,
      filename: federationConfig.name,
      remotes: federationConfig.remotes,
      exposes:federationConfig.exposes,
      shared: Object.assign(
        {},
        ...federationConfig.shared.map(([name, version]) => ({
          [name]: {
            eager: true,
            singleton: true,
            requiredVersion: version
          }
        })))
    }),

    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      __isProd__
    }),
  ].concat(
    argv['a'] ? new BundleAnalyzerPlugin() : []
  ),
  module: {
    rules: [
      {
        test: /.jsx?$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        options: { presets, plugins }
      },
      {
        test: /.less$/,
        exclude: /(node_modules)/,
        use: ['style-loader', 'css-loader', 'less-loader']
      }
    ],
  }
}


module.exports = config