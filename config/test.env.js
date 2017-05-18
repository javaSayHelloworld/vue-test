var merge = require('webpack-merge')
var devEnv = require('./dev.env')

module.exports = merge(devEnv, {
  NODE_ENV: '"testing"',
  XMPP_SERVER: '"http://10.7.92.23:8081"'
})
