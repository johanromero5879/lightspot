<template>
  <main>
    <div class="column">
      <v-card class="FiltroUbi" height="30">
        <v-card-title class="blue-grey darken-1 py-3 white--text"
          >Filters</v-card-title
        >
        <v-card-text class="blue-grey lighten-3">
          <v-row>
            <v-col>
              <v-combobox
                v-model="state"
                :items="listStates"
                placeholder= "Select"
                label="Departament"
                @change="selectState($event)"
              ></v-combobox>
            </v-col>
            <v-col>
              <v-combobox
                v-model="city"
                :items="listCities"
                 placeholder= "Select"
                label="Municipality"
                 @change="selectCity($event)"
              ></v-combobox>
            </v-col>
            <v-col>
              <v-menu
                ref="menu"
                v-model="menu"
                :close-on-content-click="false"
                :return-value.sync="date"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="date"
                      label="Date range"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                <v-date-picker v-model="date" no-title scrollable range>
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="menu = false">
                    Cancel
                  </v-btn>
                  <v-btn text color="primary" @click="$refs.menu.save(date)">
                    OK
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>
            <v-col>
              <v-btn depressed color="primary" @click="loadFlashes"> Search</v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <l-map class="map" @update:zoom="handleZoom" ref="map" >
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
import { findFlashes } from "@/services/flash/find-flashes";
import { findStates } from "@/services/location/find-states";
import { findCities } from "@/services/location/find-cities";

export default {
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LCircle,
  },
  methods: {
    handleZoom(zoom) {
      if (zoom>=10){
        this.circle.radius=50
      }else{
       this.circle.radius=4 
      }

      console.log(zoom);
    },
    
    async loadFlashes() {
      const query = {
        start_date: this.date[0],
        end_date: this.date[1],
        state: this.state,
        city: this.city,
      };
      let flashes = await findFlashes(query);
      console.log(flashes);
      this.markers = flashes.map((flash) => [flash.lat, flash.lon]);
    },
    async selectState(name) {
      this.city = "";
      const cities = await findCities(name);
      this.cities = cities;
      this.listCities= cities.map(({city})=> city);
      const state = this.states.filter((s)=> s.state==name)[0];
      this.flyTo(state.lat,state.lon,8);
    },
    async selectCity(name) {
      const city = this.cities.filter((c)=> c.city==name)[0];
      this.flyTo(city.lat,city.lon,12);
    },
    flyTo(lat,lon,zoom=7){
      this.$refs.map.mapObject.flyTo([lat,lon],zoom);
    }
  }, 
   async created() {
    const states = await findStates();
    this.states = states;
    this.listStates= states.map(state=> state.state)
  },
mounted(){
  //Colombia
this.flyTo(4.099917,-72.9088133,5);
},
  data: () => ({
    map: null,
    menu: false,
    date: null,
    listStates: [],
    states: [],
    state: "",
    listCities: [],
    cities: [],
    city: "",
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
<style scoped>
.map {
  z-index: 0 !important;
  height: 400px;
}
.column {
  display: flex;
  flex-direction: column;
  gap: 130px;
}
</style>
