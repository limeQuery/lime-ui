'use strict';
process.env.NODE_ENV = 'development'

const
  Webpack = require('webpack'),
  WebpackDevServer = require('webpack-dev-server'),
  webpackConfig = require('../config/webpack.config'),
  compiler = Webpack(webpackConfig)


/** @type {import('webpack-dev-server').Configuration} */
const devServerOptions = {
  // open: true,
  hot: true,
  port: 3333,
};

const server = new WebpackDevServer(devServerOptions, compiler);

console.log('Starting server...');
server.start(err => {
  console.log(">> err \n", err)
});