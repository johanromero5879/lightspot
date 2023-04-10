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
    ...mapActions("auth", ["fetchToken"]),
  },
  created() {
    const setup = async () => {
      if (!this.timer) {
        await this.fetchToken();
      }
      await this.fetchCurrentUser();
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
    // margin-left: calc(2rem + 32px);

    @include up-to-tablet-landscape {
      padding-left: 6rem;
    }

    @include for-desktop-up {
      margin-left: calc(2rem + 32px);
    }

    @media (min-width: 1264px) {
      margin-left: var(--sidebar-width);
    }
  }
}
</style>
