const deps = require('../package.json');

module.exports = {
  name: deps.name,
  port: 3000,
  shared: ['react', 'react-dom', 'antd', 'classnames'].map(name => [name, deps.dependencies[name]]),
  remotes: {
    app1: "app1@//localhost:3001/app1"
  },
  exposes: {}
}