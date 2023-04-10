import Vue from "vue";
import VueRouter, { RouteConfig, NavigationGuardNext, Route } from "vue-router";

import store from "@/store";
import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import UploadView from "@/views/UploadView.vue";
import MapView from "../views/MapView.vue";
import UserView from "../views/UserView.vue";
import InsightsView from "@/views/InsightsView.vue";
import ReportView from "@/views/ReportView.vue";
import RemoveFlashesView from "@/views/RemoveFlashesView.vue";

Vue.use(VueRouter);

const navGuard = async (
  to: Route,
  from: Route,
  next: NavigationGuardNext,
  scope: string | null = null
) => {
  const isAuthenticated = store.getters["auth/isAuthenticated"];

  if (!isAuthenticated) return next("/");
  if (!scope) return next();

  const authorized = await store.dispatch("user/hasScope", scope);
  if (authorized) return next();

  return next("/");
};

const routes: Array<RouteConfig> = [
  {
    path: "/",
    component: HomeView,
    children: [
      {
        path: "",
        name: "insights",
        component: InsightsView,
      },
      {
        path: "map",
        name: "map",
        component: MapView,
      },
      {
        path: "report",
        name: "report",
        component: ReportView,
        beforeEnter: (to, from, next) =>
          navGuard(to, from, next, "generate_flashes_report"),
      },
      {
        path: "upload",
        name: "upload",
        component: UploadView,
        beforeEnter: (to, from, next) =>
          navGuard(to, from, next, "upload_flashes_data"),
      },
      {
        path: "/flashes/remove",
        name: "remove-flashes",
        component: RemoveFlashesView,
        beforeEnter: (to, from, next) =>
          navGuard(to, from, next, "remove_my_uploaded_flashes"),
      },
      {
        path: "user",
        name: "user",
        component: UserView,
      }
    ],
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
    beforeEnter: (to, from, next) => {
      const isAuthenticated = store.getters["auth/isAuthenticated"];

      if (isAuthenticated) return next("/");
      next();
    },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
