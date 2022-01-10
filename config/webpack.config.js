const
  path = require('path'),
  fs = require('fs')

const
  webpack = require('webpack'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin'),
  TerserPlugin = require('terser-webpack-plugin'),
  MergeIntoSingleFilePlugin = require('webpack-merge-and-include-globally'),
  CompressionPlugin = require("compression-webpack-plugin"),
  { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer'),
  { presets, plugins } = require('./babel.config')


const
  NODE_ENV = process.env.NODE_ENV ?? 'development',
  __isDEV__ = NODE_ENV === 'development',
  __isProd__ = NODE_ENV === 'production',
  reactVendorName = 'react-vendor.js'

const
  root = path.resolve(__dirname, '../'),
  html = path.resolve(root, 'src', 'public', 'index.html')


/** @type {import('webpack').Configuration} */
const config = {
  context: root,
  entry: './src/view/index.js',
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
  resolve: {
    alias: {
      '~': root,
      '@pages': path.resolve(root, 'src', 'view', 'pages'),
      '@components': path.resolve(root, 'src', 'view', 'components'),
      '@HOC': path.resolve(root, 'src', 'view', 'HOC'),
    }
  },
  resolveLoader: {
    alias: {
      'binding-loader': path.resolve(root, 'config', 'binding-loader.js')
    }
  },
  optimization: {
    splitChunks: {
      chunks: 'async',
      cacheGroups: {
        commons: {
          chunks: 'all',
          name: "vendors",
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
      }
    },
    minimize: __isProd__,
    minimizer: [
      new TerserPlugin({
        parallel: true, // muti-process 
        extractComments: __isProd__,
      }),
    ]
  },
  externalsType: 'umd',
  externals: [
    {
      'react': 'React',
      'react-dom': 'ReactDOM',
    }
  ],
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
    new HtmlWebpackTagsPlugin({
      tags: [reactVendorName],
      append: false
    }),
    new MergeIntoSingleFilePlugin({
      files: {
        [reactVendorName]: [
          path.resolve(root, 'node_modules', 'react', 'umd', __isProd__ ? 'react.production.min.js' : 'react.development.js'),
          path.resolve(root, 'node_modules', 'react-dom', 'umd', __isProd__ ? 'react-dom.production.min.js' : 'react-dom.development.js'),
        ]
      }
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    new CompressionPlugin({
      test: /^(react).*\.js$/
    }),
    new BundleAnalyzerPlugin(),
  ],
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