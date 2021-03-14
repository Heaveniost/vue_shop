import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Welcome from '@/components/Welcome'
import Users from '@/components/user/Users'
import Auth from '@/components/power/Auth'
import Role from '@/components/power/Role'
import Category from '@/components/goods/Category'
import Params from '@/components/goods/Params'
import List from '@/components/goods/List'

Vue.use(Router)

const router = new Router({
    routes: [
        { path: '/', redirect: '/login' },
        { path: '/login', component: Login },
        {
            path: '/home', component: Home, redirect: '/welcome', children: [
                { path: '/welcome', component: Welcome },
                { path: '/users', component: Users },
                { path: '/rights', component: Auth },
                { path: '/roles', component: Role },
                { path: '/categories', component: Category},
                { path: '/params', component: Params},
                { path: '/goods', component: List}
            ]
        }
    ]
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
    if (to.path === '/login') return next();
    const tokenStr = window.sessionStorage.getItem('token');
    if (!tokenStr) return next('/login');
    next();
})

export default router 
