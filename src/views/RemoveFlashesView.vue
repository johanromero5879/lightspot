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
      <div class="form">
        <v-combobox
          v-model="selectedFile"
          :items="files"
          class="combobox"
          label="Archivo"
          outlined
          clearable
          dense
          prepend-inner-icon="mdi-file-document"
        />
        <v-btn
          class="error"
          :disabled="flashes_by_file.length === 0 || loading"
          @click="onConfirm"
        >
          <v-icon>mdi-delete-forever</v-icon>
          Eliminar
        </v-btn>
      </div>
      <v-data-table
        :headers="headers"
        :items="flashes_by_file"
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
import { mapActions } from "vuex";

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
        { text: "Departamento", value: "location.state" },
      ],
      flashes: [],
      files: [],
      selectedFile: "",
    };
  },
  filters: {
    formatDate(datetime) {
      return moment.utc(datetime).format("YYYY/MM/DD HH:mm:ss.SSS");
    },
  },
  computed: {
    flashes_by_file() {
      if (!this.selectedFile) return this.flashes;

      return this.flashes.filter((flash) => flash.file === this.selectedFile);
    },
  },
  methods: {
    ...mapActions("dialog", ["openDialog"]),
    ...mapActions("notifier", ["showNotification"]),
    async fetchFlashes() {
      try {
        this.loading = true;
        const { files, flashes } = await findFlashesByUser("day");
        this.files = files;
        this.flashes = flashes;

        if (this.files.length > 0) {
          this.selectedFile = this.files[0];
        }
      } catch (err) {
        // nothing
      } finally {
        this.loading = false;
      }
    },
    onConfirm() {
      let message;
      if (!this.selectedFile) {
        message = "Se encuentra a punto de eliminar los registros que usted ha subido en el último día."
      } else {
        message = `Se encuentra por eliminar los registros del archivo ${this.selectedFile} subido en el último día.`
      }

      this.openDialog({
        title: "¿Está seguro de eliminar?",
        message,
        type: "error",
        confirm: this.deleteFlashes,
      });
    },
    async deleteFlashes() {
      try {
        this.loading = true;

        await removeFlashesLastDay(this.selectedFile)
        this.files = this.files.filter(file => file !== this.selectedFile)

        this.clear()
        
        this.showNotification({
          message: "Registros del último día eliminados exitosamente",
          type: "success",
        });
      } catch (err) {
        this.showNotification({
          message: "Error al eliminar los registros del último día",
          type: "error",
        });
      } finally {
        this.loading = false;
      }
    },
    clear() {
      if (this.files.length == 0) {
        this.files = []
        this.selectedFile = ""
        this.flashes = []
        return
      }
      
      this.selectedFile = this.files[0]
      this.flashes = this.flashes.filter(flash => flash.file === this.selectedFile)
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

  .form {
    display: grid;
    gap: 1rem;
    grid-template-columns: 350px 150px;

    @include up-to-tablet-portrait {
      display: flex;
      flex-direction: column;
      gap: 0;
    }
  }
}
</style>
