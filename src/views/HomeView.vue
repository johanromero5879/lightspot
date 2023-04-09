<template>
  <div class="app-container">
    <Sidebar />
    <router-view />
  </div>
</template>

<script>
import Vue from "vue";
import { mapActions, mapGetters } from "vuex";

import Sidebar from "@/components/SideBar.vue";

export default Vue.extend({
  components: {
    Sidebar,
  },
  computed: {
    ...mapGetters("auth", ["timer"]),
    ...mapGetters("auth", ["isAuthenticated"]),
  },
  watch: {
    isAuthenticated(newState) {
      if (!newState) {
        this.$router.push("/").catch(()=>{});
      }
    },
  },
  methods: {
    ...mapActions("user", ["fetchCurrentUser"]),
    ...mapActions("auth", ["fetchToken", "logout"]),
  },
  created() {
    const setup = async () => {
      if (!this.timer) {
        await this.fetchToken();
      }
      await this.fetchCurrentUser();
      // await this.logout()
    };
    setup();
  },
});
</script>

<style lang="scss" scoped>
@import "src/main.scss";

.app-container {
  display: flex;
  main {
    flex: 1 1 0;
    padding: 2rem;
    background-color: inherit;
    width: 100%;
    min-height: 100vh;

    @include up-to-tablet-landscape {
      padding-left: 6rem;
    }
  }
}
</style>
