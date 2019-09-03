import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Dashboard from '@/components/Dashboard'

import BookList from '@/components/book/list'
import BookCategoryList from '@/components/bookcategory/list'

import UserList from '@/components/user/list'
import UserChangePwd from '@/components/user/changepwd'
import UserProfile from '@/components/user/profile'

// 懒加载方式，当路由被访问的时候才加载对应组件
const Login = resolve => require(['@/components/Login'], resolve)
const Register = resolve => require(['@/components/Register'], resolve)

Vue.use(Router)

let router = new Router({
// mode: 'history',
  routes: [
    {
      path: '/login',
      name: '登录',
      component: Login
    },
    {
      path: '/register',
      name: '注册',
      component: Register
    },
    {
      path: '/',
      name: 'home',
      component: Home,
      redirect: '/dashboard',
      leaf: true, // 只有一个节点
      menuShow: true,
      iconCls: 'iconfont icon-home', // 图标样式class
      children: [
        {path: '/dashboard', component: Dashboard, name: '首页', menuShow: true}
      ]
    },
    {
      path: '/',
      component: Home,
      name: '用户管理',
      menuShow: true,
      //leaf: true, // 只有一个节点
      iconCls: 'iconfont icon-users', // 图标样式class
      children: [
        {path: '/user/list', component: UserList, name: '用户列表', menuShow: true}
      ]
    },
    /*{
      path: '/',
      component: Home,
      name: '用户管理',
      menuShow: true,
      iconCls: 'iconfont icon-users',
      children: [
        {path: '/user/list', component: UserList, name: '用户列表', menuShow: true},
      ]
    },*/
    {
      path: '/',
      component: Home,
      name: '会议馆场管理',
      menuShow: true,
      iconCls: 'iconfont icon-books',
      children: [
        {path: '/book/list', component: BookList, name: '会议场馆列表', menuShow: true},
      ]
    },
    {
      path: '/',
      component: Home,
      name: '预约管理',
      menuShow: true,
      iconCls: 'iconfont icon-books',
      children: [
        {path: '/book/category', component: BookCategoryList, name: '会议场馆预约', menuShow: true}
      ]
    },
    {
      path: '/',
      component: Home,
      name: '设置',
      menuShow: true,
      iconCls: 'iconfont icon-setting1',
      children: [
        {path: '/user/profile', component: UserProfile, name: '个人信息', menuShow: true},
        {path: '/user/changepwd', component: UserChangePwd, name: '修改密码', menuShow: true}
      ]
    }
  ]
})



export default router
