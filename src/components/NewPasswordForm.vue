<template>
  <v-dialog v-model="showDialog" persistent max-width="400px">
    <v-card>
      <v-card-title>
        <span class="text-h5 card-title">Crear contraseña</span>
      </v-card-title>
      <v-card-text>
        <v-form
          ref="form"
          id="new-password-form"
          v-model="isValid"
          lazy-validation
          @submit.prevent="submit"
        >
          <PasswordField v-model="form.password" />

          <PasswordField
            v-model="form.confirmPassword"
            label="Confirmar contraseña"
            :rules="confirmPasswordRule"
          />

          <div v-if="alert.show" class="alert">
            <v-icon class="red--text accent-3">mdi-alert-circle-outline</v-icon>
            <span class="red--text accent-3">{{ alert.message }}</span>
          </div>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          class="btn-primary"
          type="submit"
          form="new-password-form"
          :loading="loading"
        >
          Guardar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { registerPassword } from "@/services/auth";

import PasswordField from "./PasswordField.vue";

export default {
  components: {
    PasswordField,
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    registrationToken: {
      type: String | null,
      required: true,
    },
  },
  watch: {
    value(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.showDialog = newValue;
      }
    },
  },
  computed: {
    confirmPasswordRule() {
      return [
        (v) => !!v || "Este campo es requerido",
        (v) => v === this.form.password || "No coincide con la contraseña",
      ];
    },
  },
  data() {
    return {
      loading: false,
      isValid: true,
      showDialog: false,
      show: {
        password: false,
        confirmPassword: false,
      },
      form: {
        password: "",
        confirmPassword: "",
      },
      alert: {
        show: false,
        message: "",
      },
    };
  },
  methods: {
    async submit() {
      if (!this.validateForm() || this.loading) return;

      try {
        this.loading = true;
        await registerPassword(this.form.password, this.registrationToken);
        this.showDialog = false;
        this.$emit("submited");
      } catch (err) {
        this.showAlert(err.message);
      } finally {
        this.loading = false;
      }
    },
    validateForm() {
      return this.$refs.form.validate();
    },
    showAlert(message) {
      this.alert.message = message;
      this.alert.show = true;

      setTimeout(() => {
        this.alert.show = false;
        this.alert.message = "";
      }, 5000);
    },
  },
};
</script>

<style lang="scss" scoped>
.card-title {
  padding-bottom: 0.5rem;
}

.v-card__text {
  padding-bottom: 0 !important;
}

.alert {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: 0.2s ease-in-out;
  margin-top: 1rem;
}
</style>
