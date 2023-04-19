<template>
  <main class="container">
    <v-card class="card">
      <div class="row">
        <v-form
          ref="form"
          class="form"
          v-model="isValid"
          lazy-validation
          @submit.prevent="handleSubmit"
        >
          <v-img
            class="logo"
            width="250"
            height="60"
            src="@/assets/long_logo.png"
            contain
            @click="() => $router.push('/')"
          ></v-img>
          <h2 class="text-h6">Iniciar sesión</h2>
          <v-text-field
            v-model="user.email"
            :rules="emailRules"
            label="Correo"
            outlined
            autocomplete="false"
            prepend-inner-icon="mdi-account-circle"
          />
          <PasswordField 
            v-model="user.password"
            :rules="passwordRules"
          />
          <v-btn class="btn-primary" block :loading="loading" type="submit">
            Acceder
          </v-btn>
          <!-- <div class="link">
            <router-link to="/password/reset"
              >¿Ha olvidado su contraseña?</router-link
            >
          </div> -->
          <div v-if="alert.show" class="alert">
            <v-icon class="red--text accent-3">mdi-alert-circle-outline</v-icon>
            <span class="red--text accent-3">{{ alert.message }}</span>
          </div>
        </v-form>
        <v-carousel
          cycle
          hide-delimiters
          show-arrows-on-hover
          class="carousel"
          height="520"
        >
          <v-carousel-item
            v-for="(slide, i) in slides"
            :key="i"
            :src="slide.src"
            cover
          >
          </v-carousel-item>
        </v-carousel>
      </div>
    </v-card>
  </main>
</template>

<script>
import { mapActions } from "vuex";
import PasswordField from "@/components/PasswordField.vue";

export default {
  components: {
    PasswordField
  },
  computed: {
    mobile() {
      return this.$vuetify.breakpoint.mobile;
    },
    slides() {
      let images = [];
      for (let index = 1; index <= 10; index++) {
        images.push({ src: require(`../assets/img/carousel/img${index}.jpg`) });
      }

      return images;
    },
  },
  methods: {
    ...mapActions("auth", ["login"]),
    async handleSubmit() {
      if (!this.validateForm() || this.loading) return;

      this.loading = true;
      try {
        await this.login(this.user);

        this.$router.push("/");
      } catch (err) {
        this.showAlert(err.message)
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
      }, 5000)
    }
  },
  data: () => ({
    loading: false,
    isValid: true,
    alert: {
      show: false,
      message: ""
    },
    emailRules: [
      (v) => !!v || "El correo es requerido",
      (v) =>
        /.+@.+\..+/.test(v) || "Introduzca una dirección de correo electrónico",
    ],
    passwordRules: [(v) => !!v || "La contraseña es requerida"],
    user: {
      email: "",
      password: "",
    },
  }),
};
</script>

<style lang="scss" scoped>
@import "src/main.scss";

.container {
  /* Gradient */
  background: rgb(246,246,246);
  background: linear-gradient(90deg, rgba(246,246,246,1) 4%, rgba(255,255,255,1) 84%);

  
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;

  .row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;

    @include up-to-tablet-portrait {
      grid-template-columns: 1fr;
    }
  }

  .logo {
    margin: 0 auto;
    margin-bottom: 1rem;
    cursor: pointer;
  }

  .card {
    width: 900px;

    @include up-to-tablet-portrait {
      max-width: 500px;
    }

    @include for-phone-only {
      width: 100%;
    }

    .form {
      padding: 4rem;

      @include for-phone-only {
        padding: 2rem 1.5rem;
      }

      h2 {
        text-align: left;
        margin-bottom: 1rem;
      }

      .link {
        margin-top: 1rem;
        text-align: left;
      }

      .alert {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transition: 0.2s ease-in-out;
        margin-top: 1rem;
      }
    }

    .carousel {
      height: 600px;
      border-top-right-radius: 5px;
      border-bottom-right-radius: 5px;

      @include up-to-tablet-portrait {
        display: none;
      }
    }
  }
}
</style>
