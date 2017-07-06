var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  XMPP_SERVER: '"http://xx.xx.xx.xx:8081"'
})
