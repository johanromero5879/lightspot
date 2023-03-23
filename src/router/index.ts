import Vue from 'vue'
import VueRouter, { RouteConfig, NavigationGuardNext, Route } from 'vue-router'

import store from "@/store"
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import UploadView from '../views/UploadView.vue'

Vue.use(VueRouter)

const navGuard = (to: Route, from: Route, next: NavigationGuardNext, permission: string | null) => {
  const isAuthenticated = store.getters["auth/isAuthenticated"]
  const user = store.getters["user/currentUser"]

  if (!isAuthenticated) return next("/login")

  
  if (!!permission && user?.role.permissions.includes(permission)) {
    return next()
  } else {
    return next("/login")
  }

  
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
        beforeEnter: (to, from, next) => navGuard(to, from, next, "upload_flashes_data")
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
