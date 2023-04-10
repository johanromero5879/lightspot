<template>
  <main>
    <div class="container">
      <v-stepper alt-labels v-model="step">
        <v-stepper-header>
          <v-stepper-step step="1">Cargar archivo</v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step step="2">Previsualización</v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step step="3">Enviar</v-stepper-step>
        </v-stepper-header>
      </v-stepper>
      <DropFile
        :allowedExtensions="['txt', 'loc', 'csv']"
        @uploadedFiles="readFile($event[0])"
      />
      <template v-if="step === 1">
        <small class="info-text">
          <v-icon color="info">mdi-information-outline</v-icon>
          El archivo subido debe tener el formato de datos que maneja la WWLLN.
        </small>
        <small class="info-text">
          <v-icon color="info">mdi-information-outline</v-icon>
          Debido al procesamiento de ubicaciones, el tamaño del archivo está
          limitado a 3 MB.
        </small>
      </template>
      <template v-if="step === 2">
        <small class="info-text">
          <v-icon color="info">mdi-information-outline</v-icon>
          Esta viendo una previsualización de {{ flashes.length }}/{{ total }}
          registros. Tenga en cuenta que el servidor validará el archivo por
          completo.
        </small>
        <small class="info-text">
          <v-icon color="info">mdi-information-outline</v-icon>
          <span>
            Una vez subido el archivo, tiene <strong>un día</strong> para eliminar los datos en la sección <strong>Último registro</strong>.
          </span>
        </small>
        <small class="info-text">
          <v-icon color="info">mdi-information-outline</v-icon>
          Los registros subidos se irán almacenando en una base de datos.
        </small>
        <v-btn class="btn-primary" @click="openConfirmDialog">
          Cargar archivo
        </v-btn>
      </template>
      <Loader
        v-if="step === 3"
        message="¡Espera! Procesar ubicaciones puede tomar 8-12 minutos"
      />
      <v-data-table
        :headers="headers"
        :items="flashes"
        hide-default-footer
        disable-sort
        no-data-text="Ningún archivo ha sido cargado"
        loading-text="Cargando..."
      >
      </v-data-table>
    </div>
  </main>
</template>

<script>
import { mapActions } from "vuex";

import Loader from "@/components/Loader.vue";
import DropFile from "@/components/DropFile.vue";
import { uploadFile, processFilePreview } from "@/services/flash";

export default {
  components: {
    Loader,
    DropFile,
  },
  data() {
    return {
      step: 1,
      file: null,
      headers: [
        { text: "Fecha de ocurrencia", value: "occurrence_date" },
        { text: "Latitud", value: "lat" },
        { text: "Longitud", value: "lon" },
        { text: "Error residual de ajuste", value: "residual_fit_error" },
        { text: "Estaciones", value: "stations" },
      ],
      flashes: [],
      total: 0,
    };
  },
  methods: {
    ...mapActions("notifier", ["showNotification"]),
    ...mapActions("dialog", ["openDialog"]),
    clear() {
      this.file = null;
      this.flashes = [];
      this.total = 0;
      this.resetStep();
    },
    setStep(step) {
      if (step === "upload") {
        this.step = 1;
        return;
      }

      if (step === "preview") {
        this.step = 2;
        return;
      }

      if (step === "submit") {
        this.step = 3;
        return;
      }
    },
    resetStep() {
      this.step = 1;
    },
    openConfirmDialog() {
      this.openDialog({
        title: "Cargar archivo",
        message: `El servidor va a filtrar y guardar solo los registros de Colombia. 
                  Dependiendo de la cantidad que haya, puede tardar varios minutos en cargar los datos.`,
        confirm: this.handleSubmit,
      });
    },
    async handleSubmit() {
      this.setStep("submit");
      try {
        const { processed_records } = await uploadFile(this.file);

        this.openDialog({
          title: "Archivo cargado exitosamente",
          message: `Registros procesados: ${processed_records}`,
          confirm: null,
        });
      } catch (err) {
        this.showNotification({
          message: err.message,
          type: "error",
        });
      } finally {
        this.clear();
      }
    },
    async readFile(file) {
      this.file = file;
      try {
        const [flashes, total] = await processFilePreview(this.file);

        this.flashes = flashes;
        this.total = total;
        this.setStep("preview");
      } catch (err) {
        this.clear();
        this.showNotification({
          message: err.message,
          type: "error",
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "src/main.scss";

.container {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @include for-big-desktop-up {
    padding: 0 4rem;
  }

  .list {
    background-color: var(--light-alt);
  }
}
</style>
