<template>
  <v-card class="card">
    <div class="header">
      <v-icon class="icon">mdi-account-group</v-icon>
      <span class="text-h5">Añadir miembros</span>
    </div>

    <v-form 
      v-model="isValid"
      lazy-validation
      @submit.prevent="submit"
      ref="form" 
      class="form"
    >
      <v-text-field
        v-model="user.fullname"
        class="textfield"
        label="Nombre completo"
        :rules="[rules.required, ...rules.fullname]"
        outlined
        autocomplete="false"
        prepend-inner-icon="mdi-account-circle"
      />

      <v-combobox
        v-model="user.role"
        :items="roles"
        :rules="[rules.required]"
        class="combobox"
        label="Rol"
        outlined
        prepend-inner-icon="mdi-account-details"
      />

      <v-text-field
        v-model="user.email"
        :rules="[rules.required, ...rules.email]"
        class="textfield"
        label="Correo"
        outlined
        autocomplete="false"
        prepend-inner-icon="mdi-email"
      />

      <v-btn 
        class="btn-primary"
        type="submit"
        :loading="loading"
      >
        Enviar invitación
      </v-btn>
    </v-form>
  </v-card>
</template>

<script>
import { mapActions } from "vuex"

import { findRoles } from "@/services/role";
import { registerUser } from "@/services/user"

export default {
  data() {
    return {
      loading: false,
      isValid: true,
      roles: [],
      user: {
        fullname: "",
        email: "",
        role: "admin",
      },
      rules: {
        required: v => !!v || "Este campo es requerido",
        fullname: [
          v => (v.length >= 2 && v.length <= 50) || "Entre 2-50 caracteres"
        ],
        email: [
          v => (/.+@.+\..+/.test(v)) || "Introduzca una dirección de correo electrónico"
        ]
      }
    };
  },
  methods: {
    ...mapActions("notifier", ["showNotification"]),
    
    async fetchRoles() {
      try {
        const roles = await findRoles();
        this.roles = roles.map((role) => role.name);
      } catch (err) {
        this.showNotification({
          message: "Error al cargar los roles",
          type: "error"
        })
      }
    },

    async submit() {
      if (!this.validate() || this.loading) return

      this.loading = true;
      try {
        await registerUser(this.user)
        this.clear()
        this.$emit("submited")

        this.showNotification({
          message: "Se envió un correo al usuario para activar su cuenta",
          type: "success"
        })
      } catch (err) {
        this.showNotification({
          message: err.message,
          type: "error"
        })
      } finally {
        this.loading = false;
      }
    },

    validate() {
      return this.$refs.form.validate()
    },

    clear() {
      this.user = {
        fullname: "",
        email: "",
        role: "admin",
      }
      this.$refs.form.resetValidation()
    }
  },
  created() {
    this.fetchRoles();
  },
};
</script>

<style lang="scss" scoped>
@import "src/main.scss";

.card {
  padding: 1rem 0;


  @include up-to-tablet-portrait {
    padding: 2rem 0;
  }

  @include for-phone-only {
    padding: 1rem; 
  }
}

.header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 1rem;

  .icon {
    font-size: 4rem;
    color: var(--primary-alt);

    @include for-phone-only {
      font-size: 3rem;
    }
  }
}

.form {
    display: grid;
    grid-template-columns: 300px 200px;
    column-gap: 1rem;
    align-items: flex-start;
    justify-content: center;

    @include up-to-tablet-portrait {
      grid-template-columns: 300px;
    }

    @include for-phone-only {
      display: flex;
      flex-direction: column;
      align-items: stretch;
    }

    .btn-primary {
      margin-top: 0.5rem;

      @include up-to-tablet-portrait {
        margin-top: 0;
      }
    }
  }
</style>
