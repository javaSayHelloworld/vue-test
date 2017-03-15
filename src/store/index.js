import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import channel from './modules/channel'

Vue.use(Vuex)

// const state = {
//   channel: {
//     name: '',
//     code: '',
//     status: '0',
//     pushedNum: 15,
//     timeout: 240,
//     visibleTime: 15,
//     maxSessionNum: 5,
//     autoJoinByOrg: '',
//     autoJoinByUserTpye: '',
//     num: 0,
//     multipleSelection: new Set()
//   }
// }
//
// const mutations = {
//   changeChannel (state, obj) {
//     state.channel.name = obj.name
//     state.channel.code = obj.code
//     state.channel.status = obj.status
//     state.channel.pushedNum = obj.pushedNum
//     state.channel.timeout = obj.timeout
//     state.channel.visibleTime = obj.visibleTime
//     state.channel.maxSessionNum = obj.maxSessionNum
//   },
//   manageChannelUser (state, obj) {
//     obj.tableData.forEach(row => {
//       state.channel.multipleSelection.delete(row.id)
//     })
//     obj.selectedData.forEach(row => {
//       state.channel.multipleSelection.add(row.id)
//     })
//     // removedDate.foreach(row => state.channel.multipleSelection.delete(row.id))
//     // selectedData.foreach(row => state.channel.multipleSelection.add(row.id))
//   }
// }

export default new Vuex.Store({
  actions,
  getters,
  modules: {
    channel
  }
})
