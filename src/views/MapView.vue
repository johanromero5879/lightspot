<template>
  <main class="container">
    <Filters
      v-model="loading"
      @stateSelected="onStateChange"
      @citySelected="onCityChange"
      @submitted="onSubmitFilter"
    />
    <div class="map">
      <v-card v-if="flashes.length > 0" class="card-info">
        <v-card-subtitle>
          {{ flashes.length }} / {{ this.total }} flashes
        </v-card-subtitle>
      </v-card>
      <div 
        v-if="loading"
        class="loader"
      >
        <v-card class="card">
          <v-card-title></v-card-title>
          <v-progress-circular
            :size="30"
            color="primary"
            indeterminate
          ></v-progress-circular>
          <v-card-subtitle>
            Cargando puntos
          </v-card-subtitle>
        </v-card>
      </div>
      <l-map ref="map">
        <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
        <l-circle
          v-for="(flash, index) in flashes"
          :key="index"
          :lat-lng="[flash.lat, flash.lon]"
          :radius="circle.radius"
          :color="circle.color"
        >
          <l-tooltip>
            <template v-if="!!flash.location.state">
              <strong>Departamento: </strong
              ><span>{{ flash.location.state }}</span
              ><br />
            </template>
            <strong>Ciudad: </strong><span>{{ flash.location.city }}</span
            ><br />
            <strong>Fecha: </strong
            ><span>{{ flash.occurrence_date | formatDate }}</span
            ><br />
            <strong>Lat: </strong><span>{{ flash.lat }}</span
            ><br />
            <strong>Lon: </strong><span>{{ flash.lon }}</span>
          </l-tooltip>
        </l-circle>
      </l-map>
    </div>
  </main>
</template>

<script>
import moment from "moment";
import { mapActions } from "vuex"

import { LMap, LTileLayer, LCircle, LTooltip } from "vue2-leaflet";
import Filters from "@/components/Filters.vue";
import { findFlashes } from "@/services/flash";

export default {
  components: {
    Filters,
    LMap,
    LTileLayer,
    LCircle,
    LTooltip,
  },
  filters: {
    formatDate(date) {
      return moment(date).format("YYYY/MM/DD hh:mm A");
    },
  },
  methods: {
    ...mapActions("notifier", ["showNotification"]),
    async loadFlashes(filter) {
      const limit = 5000;

      this.flashes = [];
      const flashes = await findFlashes(filter);

      if (flashes.length === 0) throw Error("No se encontraron flashes")
      
      this.total = flashes.length;

      if (this.total > limit) {
        this.flashes = flashes.slice(0, limit);
        return;
      }

      this.flashes = flashes;
    },

    onStateChange({ lat, lon, district }) {
      const zoom = !district ? 8 : 12;

      this.flyTo(lat, lon, zoom);
    },

    onCityChange({ lat, lon }) {
      this.flyTo(lat, lon, 12);
    },

    async onSubmitFilter(filter) {
      this.loading = true;

      const { lat, lon, zoom } = this.currentPlace
      this.flyTo(lat, lon, zoom)

      try {
        await this.loadFlashes(filter);
      }catch (err) {
        this.showNotification({
          type: "error",
          message: err.message
        })
      }finally{ 
        this.loading = false
      }
      
      this.loading = false;
    },

    async flyTo(lat, lon, zoom = 7) {
      this.currentPlace = {lat, lon, zoom}
      this.$refs.map.mapObject.flyTo([lat, lon], zoom);
    },
  },
  mounted() {
    //Colombia
    const currentPlace = {
      lat: 4.099917,
      lon: -72.9088133,
      zoom: 6
    }
    
    this.flyTo(currentPlace.lat, currentPlace.lon, 6);
  },
  data: () => ({
    loading: false,
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    markers: [],
    flashes: [],
    total: 0,
    circle: {
      radius: 100,
      color: "#0d3882",
    },
    currentPlace: null
  }),
};
</script>
<style lang="scss" scoped>
@import "src/main.scss";

.container {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 1.5rem;

  @include up-to-tablet-landscape {
    display: flex;
    flex-direction: column;
  }
}
.map {
  position: relative;
  border-radius: 5px;
  width: 100%;
  height: 100%;
  z-index: 0;


  .card-info {
    position: absolute;
    z-index: 999;
    top: 0;
    right: 0;
  }

  .loader {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;

    .card {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
