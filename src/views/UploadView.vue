<template>
  <main>
    <v-stepper alt-labels v-model="step">
      <v-stepper-header>
        <v-stepper-step step="1"> Upload file </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step step="2"> Preview </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step step="3"> Submit </v-stepper-step>
      </v-stepper-header>
    </v-stepper>
    <DropFile
      :allowedExtensions="['txt', 'loc']"
      @uploadedFiles="readFile($event[0])"
    />
    <div class="loader" v-if="step === 3">
      <span> Please wait! Process locations might take 8-12 minutes. </span>
      <v-progress-linear
        color="cyan"
        class="progress-bar"
        indeterminate
        rounded
        height="6"
      ></v-progress-linear>
    </div>

    <v-btn v-if="step === 2" class="btn-primary" @click="openConfirmDialog">
      Submit
    </v-btn>

    <v-data-table
      :headers="headers"
      :items="flashes"
      hide-default-footer
      disable-sort
      no-data-text="No data from any file"
      loading-text="Loading... Please wait"
    >
    </v-data-table>
  </main>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

import DropFile from "@/components/DropFile.vue";
import { uploadFile, processFilePreview } from "@/services/flash";

export default {
  components: {
    DropFile,
  },
  computed: {
    ...mapGetters("auth", ["isAuthenticated"])
  },
  watch: {
    isAuthenticated(newState) {
      if (!newState) {
        this.$router.push("/");
      }
    },
  },
  data() {
    return {
      step: 1,
      file: null,
      headers: [
        { text: "Occurrence date", value: "occurrence_date" },
        { text: "Latitude", value: "lat" },
        { text: "Longitude", value: "lon" },
        { text: "Residual fit error", value: "residual_fit_error" },
        { text: "Stations", value: "stations" },
      ],
      flashes: [],
    };
  },
  methods: {
    ...mapActions("notifier", ["showNotification"]),
    ...mapActions("dialog", ["openDialog"]),
    clear() {
      this.file = null;
      this.flashes = [];
      this.resetStep();
    },
    nextStep() {
      if (this.step <= 2) this.step += 1;
    },
    resetStep() {
      this.step = 1;
    },
    openConfirmDialog() {
      this.openDialog({
        title: "Upload file",
        message: `The server is going to filter all records to save only those from Colombia.
                  Depending of the file size this might take several minutes to process.`,
        confirm: this.handleSubmit,
      });
    },
    async handleSubmit() {
      this.nextStep();
      try {
        const { processed_records } = await uploadFile(this.file);

        this.openDialog({
          title: "Uploaded file successfully",
          message: `Processed records: ${processed_records}`,
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
        const flashes = await processFilePreview(this.file);

        this.flashes = flashes;
        this.nextStep();
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
main {
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
}

.loader {
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;
  align-items: center;
  text-align: center;
}
</style>
