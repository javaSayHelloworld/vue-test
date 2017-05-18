import channelAPI from '../../api/channel'
import orgAPI from '../../api/org'
import userAPI from '../../api/user'
import * as types from '../mutation-types'

// initial state
const state = {
  step: false,
  channels: [],
  channel: {
    id: '',
    name: '',
    code: '',
    status: '1',
    pushedNum: 15,
    timeout: 240,
    visibleTime: 15,
    maxSessionNum: 5,
    autoJoinByOrg: '',
    autoJoinByUserType: '',
    users: new Set()
  },
  orgs: [],
  titles: ['录入信息', '选择人员', '完成'],
  statusArr: ['开放策略', '半封闭策略', '封闭策略'],
  userTypes: [{ value: '1', label: '营销人员' }, { value: '2', label: '投资顾问' }, {
    value: '3', label: '总部客服' }, { value: '4', label: '柜台专员' }, { value: '9', label: '客服专员' }]
}

// getters
const getters = {
  allChannels: state => {
    state.channels.forEach((row) => {
      row.num = row.status === '0' ? '默认全部客服人员' : row.users.length + '人'
    })
    return state.channels
  },
  orgs: state => state.orgs,
  channel: state => state.channel,
  statusArr: state => state.statusArr,
  userTypes: state => state.userTypes,
  titles: state => state.titles,
  result: state => {
    let channel = state.channel
    let num = (channel.status === '0') ? '默认全部客服人员' : channel.users.size + '人'
    let tableData = [
      {key1: '渠道名称：', value1: channel.name, key2: '渠道代码:', value2: channel.code},
      {key1: '派单策略：', value1: state.statusArr[channel.status], key2: '渠道超时时间:', value2: (channel.timeout + '秒')},
      {key1: '推送人数：', value1: (channel.pushedNum + '人/轮'), key2: '抢单时间:', value2: (channel.visibleTime + '秒')},
      {key1: '最大会话数：', value1: channel.maxSessionNum, key2: '渠道服务人数:', value2: num}
    ]
    return tableData
  }
}

// actions
const actions = {
  getAllChannels ({ commit }) {
    return new Promise((resolve, reject) => {
      channelAPI.getChannels().then(response => {
        commit(types.RECEIVE_CHANNELS, { channels: response.data })
        resolve()
      }, () => { reject() })
    })
  },
  removeChannel ({ commit }, { index, row }) {
    return new Promise((resolve, reject) => {
      channelAPI.removeChannel(row.id).then(function (response) {
        if (response.data.des === 'successful') {
          commit(types.REMOVE_CHANNEL, { index })
          resolve()
        } else reject()
      })
      .catch(function (response) {
        console.log('删除渠道出错！')
        reject()
      })
    })
  },
  saveChannel ({ commit }) {
    return new Promise((resolve, reject) => {
      channelAPI.saveChannel(state.channel).then((response) => {
        if (response.data.des === 'successful') {
          let channel = response.data.data
          commit(types.SET_CHANNEL, { channel })
          resolve()
        } else reject()
      },
      (response) => {
        console.log('=====渠道新增出错=====')
        console.log(response)
      })
    })
  },
  saveUsers ({commit}, { addUsers, removeUsers }) {
    if (addUsers.size === 0 && removeUsers.size === 0) {
      return Promise.resolve()
    } else {
      commit('ADD_CHANNEL_USER', { addUsers, removeUsers })
      return new Promise((resolve, reject) => {
        channelAPI.saveUsers(state.channel).then((response) => {
          if (response.data.des === 'successful') resolve()
          else reject()
        }).catch((response) => {
          console.log('=====渠道用户保存出错=====')
          console.log(response)
        })
      })
    }
  },
  synXmpp ({ commit }, { channelID }) {
    return new Promise((resolve, reject) => {
      channelAPI.synXmpp(channelID).then((response) => {
        if (response.data.code === 1) {
          resolve()
        } else reject()
      }, (response) => { reject() })
    })
  },
  getAllOrgs ({ commit }) {
    if (state.orgs.length === 0) {
      orgAPI.getOrgs().then(
        (response) => { state.orgs = response.data }
      )
    }
  },
  getAllUsers ({ commit }, param) {
    return userAPI.getUsers(param)
  },
  getQualifiedUsers ({ commit }, param) {
    return userAPI.getQualifiedUsers(param)
  },
  checkChannelCode ({ commit }, { code }) {
    return new Promise((resolve, reject) => {
      channelAPI.checkChannelCode(code, state.channel.id).then(
        (response) => {
          if (response.data.code === '0') {
            resolve(true)
          } else {
            resolve(false)
          }
        },
        () => { resolve(false) }
      )
    })
  },
  resetChannel ({ commit }) {
    commit(types.RESET_CHANNEL)
  }
}

// mutations
const mutations = {
  [types.RECEIVE_CHANNELS] (state, { channels }) {
    state.channels = channels
  },
  [types.REMOVE_CHANNEL] (state, { index, flag }) {
    state.channels.splice(index, 1)
  },
  [types.SET_CHANNEL] (state, { channel }) {
    let s = new Set(channel.users)
    Object.assign(state.channel, channel)
    state.channel.users = s
  },
  [types.ADD_CHANNEL_USER] (state, { addUsers, removeUsers }) {
    state.channel.addUsers = addUsers
    state.channel.removeUsers = removeUsers
    removeUsers.forEach(id => {
      state.channel.users.delete(id)
    })
    addUsers.forEach(id => {
      state.channel.users.add(id)
    })
  },
  [types.RESET_CHANNEL] (state) {
    Object.assign(state.channel, {
      id: '',
      name: '',
      code: '',
      status: '0',
      pushedNum: 15,
      timeout: 240,
      visibleTime: 15,
      maxSessionNum: 5,
      autoJoinByOrg: '',
      autoJoinByUserType: '',
      users: new Set()
    })
  },
  [types.REMOVE_STEP_TITLE] () {
    state.titles.splice(1, 1)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
