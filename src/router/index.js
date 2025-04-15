import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import MyOrders from '@/views/MyOrders.vue'
import Admin from '@/views/Admin.vue'
import Account from '@/views/Account.vue'
import Wallet from '@/views/Wallet.vue'
import MyAds from '@/views/MyAds.vue'
import AllAds from '@/views/AllAds.vue'
import AdInfo from '@/views/AdInfo.vue'
import MyAdInfo from '@/views/MyAdInfo.vue'

const routes = [
  {
    path: '/',
    redirect: '/login', // Автоматическое перенаправление с корня на /login
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
  },
  {
    path: '/myorder',
    name: 'MyOrders',
    component: MyOrders,
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
  },
  {
    path: '/account',
    name: 'Account',
    component: Account,
  },
  {
    path: '/wallet',
    name: 'Wallet',
    component: Wallet,
  },
  {
    path: '/myads',
    name: 'MyAds',
    component: MyAds,
  },
  {
    path: '/allads',
    name: 'AllAds',
    component: AllAds,
  },
  {
    path: '/adinfo/:id',
    name: 'AdInfo',
    component: AdInfo,
    props: true,
  },
  {
    path: '/myadinfo/:id',
    name: 'MyAdInfo',
    component: MyAdInfo,
    props: true,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
