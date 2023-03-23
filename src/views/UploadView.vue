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
      @fileUploaded="readFile($event)"
    />
    <v-data-table
      :headers="headers"
      :items="flashes"
      hide-default-footer
      disable-sort
      no-data-text="No data from any file"
    >
  
  </v-data-table>
  </main>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

import DropFile from "../components/DropFile.vue";
import { isFloat, isInt } from "@/utils/type-checker";

export default {
  components: {
    DropFile,
  },
  computed: {
    ...mapGetters("auth", ["isAuthenticated"])
  },
  watch: {
    isAuthenticated(newState, oldState) {
      if (!newState) {
        this.$router.push("/login")
      }
    }
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
    clear() {
      this.file = null;
      this.flashes = [];
      this.setStep(1)
    },
    setStep(step) {
      this.step = step
    },
    readFile(file) {
      this.file = file;
      const reader = new FileReader();

      reader.addEventListener("loadend", () => {
        const content = reader.result.trim();
        const records = content.split("\n");

        this.processRecords(records);
      });

      reader.readAsText(this.file, "utf-8");
    },

    processRecords(records) {
      try {
        const flashes = [];

        for (let [index, record] of records.entries()) {
          if (index === 9) break;
          const flash = this.processRecord(record);
          flashes.push(flash);
        }
        this.flashes = flashes;
        this.setStep(2)
      } catch (err) {
        this.clear();
        this.showNotification({
          message: "File format not valid",
          type: "error",
        });
      }
    },

    processRecord(record) {
      const [date, time, lat, lon, residual_fit_error, stations] =
        record.split(",");
      const row = [date, time, lat, lon, residual_fit_error, stations];

      if (row.some((column) => column === undefined)) {
        throw new Error("File format not valid");
      }

      const flash = {
        occurrence_date: `${date} ${time}`,
        lat: isFloat(lat) ? parseFloat(lat).toFixed(4) : null,
        lon: isFloat(lon) ? parseFloat(lon).toFixed(4) : null,
        residual_fit_error: isFloat(residual_fit_error)
          ? parseFloat(residual_fit_error).toFixed(1)
          : null,
        stations: isInt(stations) ? parseInt(stations) : null,
      };

      if (Object.values(flash).some((value) => value === null)) {
        throw new Error("File format not valid");
      }

      return flash;
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
</style>
