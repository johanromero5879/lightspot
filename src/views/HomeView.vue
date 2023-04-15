<template>
  <div class="app-container">
    <Sidebar />
    <router-view />

    <NewPasswordForm 
      v-model="passwordForm" 
      :registration-token="registration_token" 
      @submited="setup"
    />
  </div>
</template>

<script>
import Vue from "vue";
import { mapActions, mapGetters } from "vuex";

import { isNewUser } from "@/services/auth";

import Sidebar from "@/components/SideBar.vue";
import NewPasswordForm from "@/components/NewPasswordForm.vue";

export default Vue.extend({
  components: {
    Sidebar,
    NewPasswordForm,
  },
  props: {
    registration_token: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      passwordForm: false,
    };
  },
  computed: {
    ...mapGetters("auth", ["timer"]),
    ...mapGetters("auth", ["isAuthenticated"]),
  },
  watch: {
    isAuthenticated(newState) {
      if (!newState) {
        this.$router.push("/").catch(() => {});
      }
    },
  },
  methods: {
    ...mapActions("user", ["fetchCurrentUser"]),
    ...mapActions("auth", ["fetchToken"]),
    async setup() {
      if (!this.timer) {
        await this.fetchToken();
      }
      await this.fetchCurrentUser();
    },
    async setupNewUser() {
      this.passwordForm = await isNewUser(this.registration_token);

      // Clear query params
      if (!this.passwordForm) {
        this.$router.replace({ path: this.$route.path, query: {} });
      }
    },
  },
  async created() {
    if (!!this.registration_token) {
      this.setupNewUser()
      return;
    }

    this.setup();
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
