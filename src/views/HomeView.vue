<template>
  <div class="app-container">
    <Sidebar />
    <router-view />
  </div>
</template>

<script>
import Vue from "vue";
import { mapActions, mapGetters } from "vuex"

import Sidebar from '@/components/SideBar.vue';

export default Vue.extend({
  components: {
    Sidebar
  },
  computed: {
    ...mapGetters("auth", ["isAuthenticated"])
  },
  methods: {
    ...mapActions("user", ["fetchCurrentUser"]),
    ...mapActions("auth", ["fetchToken", "startTokenTimer"]),
  },
  created() {
    const setup = async () => {
      await this.fetchToken()
      this.startTokenTimer()
      await this.fetchCurrentUser()
    }
    setup()
  }
})
</script>

<style lang="scss" scoped>
.app-container {
  display: flex;
  main {
    flex: 1 1 0;
    padding: 2rem;
    background-color: var(--light-alt);
    min-height: 100vh;
    @media (max-width: 1024px) {
      padding-left: 6rem;
    }
  }
}
</style>
