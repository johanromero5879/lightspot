import Vue from 'vue'
import VueRouter, { RouteConfig, NavigationGuardNext, Route } from 'vue-router'

import store from "@/store"
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import UploadView from '../views/UploadView.vue'

Vue.use(VueRouter)

const authenticationGuard = (to: Route, from: Route, next: NavigationGuardNext) => {
  const isAuthenticated = store.getters["auth/isAuthenticated"]

  if (!isAuthenticated) return next("/login")
  next()
}

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    children: [
      { 
        path: "/upload", 
        name: "upload", 
        component: UploadView,
        beforeEnter: authenticationGuard
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    beforeEnter: (to, from, next) => {
      const isAuthenticated = store.getters["auth/isAuthenticated"]

      if (isAuthenticated) return next("/")
      next()
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
