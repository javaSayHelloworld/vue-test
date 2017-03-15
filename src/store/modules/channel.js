import channelAPI from '../../api/channel'
import * as types from '../mutation-types'

// initial state
const state = {
  channels: [],
  channel: {
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
  },
  statusArr: ['开放策略', '半封闭策略', '封闭策略'],
  userTypes: [{
    value: '1',
    label: '营销人员'
  }, {
    value: '2',
    label: '投资顾问'
  }, {
    value: '3',
    label: '总部客服'
  }, {
    value: '4',
    label: '柜台专员'
  }, {
    value: '9',
    label: '客服专员'
  }]
}

// getters
const getters = {
  allChannels: state => state.channels,
  channel: state => state.channel,
  statusArr: state => state.statusArr,
  userTypes: state => state.userTypes,
  result: state => {
    let channel = state.channel
    let tableData = [
      {key1: '渠道名称：', value1: channel.name, key2: '渠道代码:', value2: channel.code},
      {key1: '派单策略：', value1: state.statusArr[channel.status], key2: '渠道超时时间:', value2: (channel.timeout + '秒')},
      {key1: '推送人数：', value1: (channel.pushedNum + '人/轮'), key2: '抢单时间:', value2: (channel.visibleTime + '秒')},
      {key1: '最大会话数：', value1: channel.maxSessionNum, key2: '渠道服务人数:', value2: channel.users.size}
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
  addChannel ({ commit }) {
    return new Promise((resolve, reject) => {
      channelAPI.addChannel(state.channel).then((response) => {
        if (response.data.des === 'successful') {
          resolve()
        } else reject()
      })
    })
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
  [types.ADD_CHANNEL_USER] (state, { all, selected }) {
    all.forEach(row => {
      state.channel.users.delete(row.id)
    })
    selected.forEach(row => {
      state.channel.users.add(row.id)
    })
  },
  [types.RESET_CHANNEL] (state) {
    Object.assign(state.channel, {
      name: '',
      code: '',
      status: '0',
      pushedNum: 15,
      timeout: 240,
      visibleTime: 15,
      maxSessionNum: 5,
      autoJoinByOrg: '',
      autoJoinByUserTpye: '',
      users: new Set()
    })
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
