import Vue from 'vue'
import VueRouter from 'vue-router'
import channelMain from 'views/channel/main'
import channelFirst from 'views/channel/first'
import channelSecond from 'views/channel/second'
import channelResult from 'views/channel/result'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', name: 'channelMain', component: channelMain },
    { path: '/channel/first', name: 'channelFirst', component: channelFirst },
    { path: '/channel/second', name: 'channelSecond', component: channelSecond },
    { path: '/channel/result', name: 'channelResult', component: channelResult }
  ]
})

export default router
