<template>
  <aside :class="`${is_expanded ? 'is-expanded' : ''}`">
    <div class="logo">
      <v-img
        width="175"
        height="40"
        src="@/assets/long_logo.png"
        v-if="is_expanded"
        contain
      ></v-img>
      <v-img height="40" src="@/assets/logo.png" v-else contain></v-img>
    </div>

    <div v-if="!!currentUser" class="info-user">
      <small>Bienvenido,</small>
      <p>{{ currentUser.fullname }}</p>
    </div>
    <div v-else class="login menu">
      <router-link
        to="/login"
        class="button"
      >
        <v-icon class="material-icons">mdi-login</v-icon>
        <span class="text">Login</span>
      </router-link>
    </div>

    <h3>Menu</h3>
    <div class="menu">
      <template v-for="item in items">
        <router-link
          :key="item.title"
          v-if="hasScope(item.scope)"
          :to="item.to"
          class="button"
        >
          <v-icon class="material-icons">{{ item.icon }}</v-icon>
          <span class="text">{{ item.title }}</span>
        </router-link>
      </template>
    </div>
    <v-spacer></v-spacer>

    <div v-if="isAuthenticated" class="menu">
      <v-menu transition="slide-y-reverse-transition" top :offset-y="true">
        <template v-slot:activator="{ on, attrs }">
          <v-btn class="button settings" text v-bind="attrs" v-on="on">
            <v-icon class="material-icons">mdi-cog</v-icon>
            <span class="text">Opciones</span>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(item, index) in settings"
            :key="index"
            link
            @click="item.click"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </aside>
</template>

<script>
import Vue from "vue";
import { mapGetters, mapActions } from "vuex";

export default Vue.extend({
  computed: {
    ...mapGetters("auth", ["isAuthenticated"]),
    ...mapGetters("user", ["currentUser"]),
    is_expanded() {
      return !this.$vuetify.breakpoint.mobile;
    },
  },
  data() {
    return {
      items: [
        { title: "Dashboard", icon: "mdi-view-dashboard", to: "/" },
        { title: "Mapa", icon: "mdi-map-search", to: "/map" },
        {
          title: "Reportes",
          icon: "mdi-file-document",
          to: "/report",
          scope: "generate_flashes_report",
        },
        {
          title: "Cargar",
          icon: "mdi-cloud-upload-outline",
          to: "/upload",
          scope: "upload_flashes_data",
        },
        { title: "Usuarios", icon: "mdi-account-plus", to: "/user" },
      ],
      settings: [{ title: "Cerrar sesión", click: this.logOut }],
    };
  },
  methods: {
    ...mapActions("auth", ["logout"]),

    hasScope(scope) {
      if (!scope) return true;
      const role = this.currentUser?.role;

      return role?.permissions.some((permission) => permission === scope);
    },

    logOut() {
      this.logout();
    },
  },
});
</script>

<style lang="scss" scoped>
@import "src/main.scss";

aside {
  display: flex;
  flex-direction: column;

  background-color: var(--light);
  color: var(--dark);

  width: calc(2rem + 32px);
  overflow: hidden;
  min-height: 100vh;
  padding: 1rem;

  transition: 0.2s ease-in-out;

  .flex {
    flex: 1 1 0%;
  }

  .logo {
    margin-bottom: 1rem;
  }

  .info-user {
    color: rgba(0, 0, 0, 0.6);
    margin-bottom: 0.5rem;
    transition: 0.2s ease-in-out;

    @media (max-width: 1263px) {
      display: none;
    }
  }

  h3,
  .button .text {
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
  }

  h3 {
    color: var(--grey);
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
    text-transform: uppercase;

    @media (max-width: 1263px) {
      display: none;
    }
  }

  .menu {
    margin: 0 -1rem;

    &.login {
      @media (min-width: 1264px) {
        margin-bottom: 1rem;
      }
    }

    .button {
      display: flex;
      align-items: center;
      text-decoration: none;

      transition: 0.2s ease-in-out;
      padding: 0.5rem 1rem;

      &.settings {
        display: flex;
        width: 100%;
        justify-content: start;
        justify-items: s;
      }

      .material-icons {
        font-size: 2rem;
        color: var(--dark-alt);
        transition: 0.2s ease-in-out;
      }
      .text {
        color: var(--dark-alt);
        transition: 0.2s ease-in-out;
      }

      &:hover {
        background-color: var(--dark-alt);

        .material-icons,
        .text {
          color: var(--light);
        }
      }

      &.router-link-exact-active {
        background-color: var(--dark-alt);
        border-right: 5px solid var(--secondary);

        .material-icons,
        .text {
          color: var(--light);
        }
      }
    }
  }

  &.is-expanded {
    width: var(--sidebar-width);

    h3,
    .button .text {
      opacity: 1;
    }

    .button {
      .material-icons {
        margin-right: 1rem;
      }
    }
  }

  @include up-to-tablet-landscape {
    position: fixed;
    z-index: 99;
  }
}
</style>
