<template>
  <main class="container">
    <Filters
      v-model="loading"
      @stateSelected="onStateChange($event)"
      @citySelected="onCityChange($event)"
      @submitted="onSubmitFilter($event)"
    />
    <div class="map">
      <l-map ref="map" @update:zoom="handleZoom">
        <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
        <l-circle
          v-for="(marker, index) in markers"
          :key="index"
          :lat-lng="marker"
          :radius="circle.radius"
          :color="circle.color"
        />
      </l-map>
    </div>
  </main>
</template>

<script>
import { LMap, LTileLayer, LMarker, LCircle } from "vue2-leaflet";
import Filters from "@/components/Filters.vue";
import { findFlashes } from "@/services/flash";

export default {
  components: {
    Filters,
    LMap,
    LTileLayer,
    LMarker,
    LCircle,
  },
  methods: {
    handleZoom(zoom) {
      if (zoom >= 10) {
        this.circle.radius = 50;
      } else {
        this.circle.radius = 4;
      }
    },

    async loadFlashes(filter) {
      this.markers = [];
      const flashes = await findFlashes(filter);

      this.markers = flashes.map((flash) => [flash.lat, flash.lon]);
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
      await this.loadFlashes(filter);
      this.loading = false;
    },

    async flyTo(lat, lon, zoom = 7) {
      this.$refs.map.mapObject.flyTo([lat, lon], zoom);
    },
  },
  mounted() {
    //Colombia
    this.flyTo(4.099917, -72.9088133, 6);
  },
  data: () => ({
    loading: false,
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    markers: [],
    circle: {
      radius: 4,
      color: "#00CFC5",
    },
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
  border-radius: 5px;
  width: 100%;
  z-index: 0 !important;

  @include up-to-tablet-landscape {
    height: 400px;
  }
}
</style>
