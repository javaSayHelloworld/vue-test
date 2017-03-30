import Vue from 'vue'
import Router from 'vue-router'
import channelMain from 'views/channel/main'
import channelFirst from 'views/channel/first'
import channelSecond from 'views/channel/second'
import channelResult from 'views/channel/result'

Vue.use(Router)

export default new Router({
  routes: [
    { path: '/', name: 'channelMain', component: channelMain },
    { path: '/channel/first', name: 'channelFirst', component: channelFirst },
    { path: '/channel/second', name: 'channelSecond', component: channelSecond },
    { path: '/channel/result', name: 'channelResult', component: channelResult }
  ]
})
