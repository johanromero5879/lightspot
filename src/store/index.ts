import Vue from 'vue'
import Vuex from 'vuex'

import { notificationsModule } from "@/store/notification"
import { authModule } from "@/store/auth"

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    notificationsModule,
    authModule
  }
})
