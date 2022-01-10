'use strict';
process.env.NODE_ENV = 'production'

const webpack = require('webpack')
const webpackConfig = require('../config/webpack.config')

process.on('unhandledRejection', err => {
  throw err;
});

webpack(webpackConfig).run(stats => console.log(">> stats \n", stats))
