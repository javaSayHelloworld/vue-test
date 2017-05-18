var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  XMPP_SERVER: '"http://10.2.30.60:8081"'
})
