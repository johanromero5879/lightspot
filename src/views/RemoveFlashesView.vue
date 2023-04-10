<template>
  <main>
    <div class="container">
      <h2 class="text-h5">Últimos registros subidos</h2>
      <small class="info-text">
        <v-icon color="info">mdi-information-outline</v-icon>
        <span
          >Está visualizando los registros que <strong>usted</strong> ha
          realizado en el <strong>último día</strong>.</span
        >
      </small>
      <v-btn 
        class="error"
        :disabled="flashes.length === 0"
        @click="onConfirm"
      >
        <v-icon>mdi-delete-forever</v-icon>
        Eliminar
      </v-btn>
      <v-data-table
        :headers="headers"
        :items="flashes"
        :loading="loading"
        no-data-text="No se encontraron registros subidos del último día."
        loading-text="Cargando registro..."
      >
        <template v-slot:item.occurrence_date="{ item }">
          {{ item.occurrence_date | formatDate }}
        </template>
      </v-data-table>
    </div>
  </main>
</template>

<script>
import moment from "moment";
import { mapActions } from "vuex"

import { findFlashesByUser, removeFlashesLastDay } from "@/services/flash";

export default {
  data() {
    return {
      loading: false,
      headers: [
        { text: "Fecha de ocurrencia", value: "occurrence_date" },
        { text: "Latitud", value: "lat" },
        { text: "Longitud", value: "lon" },
        { text: "Resid", value: "residual_fit_error" },
        { text: "Estaciones", value: "stations" },
        { text: "País", value: "location.country" },
        { text: "Ciudad", value: "location.city" },
        { text: "Departamento", value: "location.state" }
      ],
      flashes: [],
    };
  },
  filters: {
    formatDate(datetime) {
      return moment.utc(datetime).format("YYYY/MM/DD HH:mm:ss.SSS");
    },
  },
  methods: {
    ...mapActions("dialog", ["openDialog"]),
    ...mapActions("notifier", ["showNotification"]),
    async fetchFlashes() {
      try {
        this.loading = true;
        this.flashes = await findFlashesByUser("day");
      } catch (err) {
        // nothing
      } finally {
        this.loading = false;
      }
    },
    onConfirm() {
      this.openDialog({
        title: "¿Está seguro de eliminar?",
        message: "Se encuentra a punto de eliminar los registros que usted ha subido en el último día",
        type: "error",
        confirm: this.deleteFlashes
      })
    },
    async deleteFlashes() {
      try {
        await removeFlashesLastDay()
        this.flashes = []

        this.showNotification({
          message: "Registros del último día eliminados exitosamente",
          type: "success"
        })
      } catch (err) {
        this.showNotification({
          message: "Error al eliminar los registros del último día",
          type: "error"
        })
      }
    }
  },
  created() {
    this.fetchFlashes();
  },
};
</script>

<style lang="scss" scoped>
@import "src/main.scss";

.container {
  @include for-desktop-up {
    padding: 0 6rem;
  }

  h2,
  .info-text {
    padding-bottom: 1rem;
  }

  .error {
    margin-bottom: 1rem;
  }
}
</style>
