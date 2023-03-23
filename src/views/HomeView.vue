<template>
  <div class="app-container">
    <Sidebar />
    <router-view />
  </div>
</template>

<script>
import Vue from "vue";
import { mapGetters, mapActions } from "vuex"

import Sidebar from '@/components/SideBar.vue';

export default Vue.extend({
  components: {
    Sidebar
  },
  computed: {
    ...mapGetters("auth", ["isAuthenticated"]),
    ...mapGetters("user", ["currentUser"])
  },
  methods: {
    ...mapActions("auth", ["logout"]),
    ...mapActions("user", ["fetchCurrentUser"])
  },
  created() {
    if (this.isAuthenticated) {
      this.fetchCurrentUser()
    }
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
