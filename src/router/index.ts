import Vue from 'vue'
import VueRouter, { RouteConfig, NavigationGuardNext, Route } from 'vue-router'

import store from "@/store"
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import UploadView from '@/views/UploadView.vue'
import InsightsView from '@/views/InsightsView.vue'

Vue.use(VueRouter)

const navGuard = (to: Route, from: Route, next: NavigationGuardNext, scope: string | null = null) => {
  const isAuthenticated = store.getters["auth/isAuthenticated"]
  const user = store.getters["user/currentUser"]
  
  if (!isAuthenticated) return next("/")
  if (!scope) return next()

  if (user?.role.permissions.includes(scope)) return next()

  return next("/")

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
      },
      { 
        path: "/insights", 
        name: "insights", 
        component: InsightsView
      },
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
