// import Vue from 'vue'
// import VueRouter from 'vue-router'

// Vue.use(VueRouter)

// const routes = [
  
// ]

// const router = new VueRouter({
//   mode: 'history',
//   base: process.env.BASE_URL,
//   routes
// })

// export default router

import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'

Vue.use(Router)

export default new Router({
    routes: [
        {path: '/', redirect: '/login'},
        {path: '/login', component: Login},
        {path: '/home', component: Home}
    ]
})

