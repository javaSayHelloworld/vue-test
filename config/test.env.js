var merge = require('webpack-merge')
var devEnv = require('./dev.env')

module.exports = merge(devEnv, {
  NODE_ENV: '"testing"',
  XMPP_SERVER: '"http://xx.xx.xx.xx:8081"'
})
