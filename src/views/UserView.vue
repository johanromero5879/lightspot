<template>
  <main>
    <div class="container">
      <UserForm @submited="fetchUsers" />
      <v-card class="table">
        <template v-if="users.length > 0">
          <v-list class="list">
            <v-subheader>Miembros</v-subheader>
            <template v-for="(user, index) in users">
              <v-list-item link class="item">
                <v-list-item-avatar class="avatar" color="grey darken-1 white--text">{{
                  user.fullname | getNameInitials
                }}</v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ user.fullname }}
                    <v-chip class="chip" color="primary" outlined small>
                      {{ user.role }}
                    </v-chip>
                    <v-chip
                      v-if="currentUser._id === user._id"
                      class="chip"
                      color="purple"
                      outlined
                      small
                    >
                      tú
                    </v-chip>
                  </v-list-item-title>
                  <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-divider v-if="index !== users.length - 1" :inset="true" />
            </template>
          </v-list>
          <v-pagination
            v-model="page"
            :length="totalPages"
            :total-visible="5"
            circle
            @input="fetchUsers"
          ></v-pagination>
        </template>
        <LoaderPanel
          v-else
          :loading="loading"
          loading-text="Cargando usuarios..."
          no-data-text="No hay usuarios para mostrar"
        />
      </v-card>
    </div>
  </main>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

import { findUsers } from "@/services/user";
import UserForm from "@/components/UserForm.vue";
import LoaderPanel from "@/components/LoaderPanel.vue";

export default {
  components: {
    UserForm,
    LoaderPanel,
  },
  filters: {
    getNameInitials(name) {
      let initials = "";
      const names = name.split(/\s+/);

      if (names.length == 1) {
        initials = names[0].charAt(0);
      }

      if (names.length == 2) {
        initials = `${names[0].charAt(0)}${names[1].charAt(0)}`;
      }

      if (names.length >= 3) {
        initials = `${names[0].charAt(0)}${names[2].charAt(0)}`;
      }

      return initials.toUpperCase();
    },
  },
  computed: {
    ...mapGetters("user", ["currentUser"]),
    totalPages() {
      return Math.ceil(this.total / this.limit);
    },
  },
  data() {
    return {
      loading: false,
      page: 1,
      limit: 5,
      users: [],
      total: 0
    };
  },
  methods: {
    ...mapActions("notifier", ["showNotification"]),

    async fetchUsers() {
      try {
        this.loading = true;
        const { total, users } = await findUsers(this.limit, this.page);

        this.total = total;
        this.users = users;
      } catch (err) {
        this.showNotification({
          message: err.message,
          type: "error",
        });
      } finally {
        this.loading = false;
      }
    },
  },
  created() {
    this.fetchUsers();
  },
};
</script>

<style lang="scss" scoped>
@import "src/main.scss";

main {
  display: flex;
  justify-content: center;
  align-items: flex-start;

  .container {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    width: 800px;
    justify-content: center;
    gap: 1.5rem;

    @include up-to-tablet-portrait {
      width: 100%;
    }

    .table {
      padding: 1rem 2rem;

      @include for-phone-only {
        padding: 0.5rem;
      }
    }

    .list {
      width: 700px;

      @include up-to-tablet-portrait {
        width: 100%;
      }

      .chip {
        margin-right: 0.2rem;
      }

      .item:nth-of-type(odd) {
        .avatar {
          background-color: #2196f3 !important;
        }
      }

      .item:nth-of-type(even) {
        .avatar {
          background-color: var(--secondary) !important;
        }
      }
    }
  }
}
</style>
