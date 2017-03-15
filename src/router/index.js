import Vue from 'vue'
import Router from 'vue-router'
import channelMain from 'views/channel/Main'
import channelAdd from 'views/channel/add'
import channelUser from 'views/channel/user'
import channelResult from 'views/channel/result'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'channelList',
      component: channelMain
    },
    { path: '/channel/add', component: channelAdd },
    { path: '/channel/user', component: channelUser },
    { path: '/channel/result', component: channelResult }
  ]
})
