import axios from 'axios'
// import jsonp from 'jsonp'

/**
 * Mocking client-server processing

const _products = [
  {"id": 1, "title": "iPad 4 Mini", "price": 500.01, "inventory": 2},
  {"id": 2, "title": "H&M T-Shirt White", "price": 10.99, "inventory": 10},
  {"id": 3, "title": "Charli XCX - Sucker CD", "price": 19.99, "inventory": 5}
]
*/
const xmppURL = process.env.XMPP_SERVER

export default {
  getChannels () {
    return axios.get('/admin/channel/list')
  },
  removeChannel (index) {
    return axios.get('/admin/channel/remove/' + index)
  },
  getUsers (pageNo, pageSize) {
    return axios.get('/admin/user/list/' + pageNo + '/' + pageSize)
  },
  saveChannel (channel) {
    return axios.post('/admin/channel/save', channel)
  },
  saveUsers (channel) {
    return axios.post('/admin/channel/saveUsers', channel)
  },
  synXmpp (channelID) {
    return axios.get(xmppURL + '/didi/internal/sync?action=channel&id=' + channelID + '&code=26CEF6155B2514B11ECEEC59F51E3013')
    // jsonp(xmppURL + '/didi/internal/sync?action=channel&id=' + channelID, null, function (err, data) {
    //   if (err) {
    //     console.error(err.message)
    //   } else {
    //     console.log(JSON.parse(data))
    //   }
    // })
  },
  checkChannelCode (code, id) {
    return axios.post('/admin/channel/check', { id, code })
  }
}
