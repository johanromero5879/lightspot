<template>
  <v-card class="filter">
    <v-card-title class="title">Filtros</v-card-title>
    <v-form class="form" @submit.prevent="onSubmit">
      <div class="section">
        <p>Ubicación</p>
        <v-combobox
          v-model="stateValue"
          outlined
          dense
          label="Departamento"
          :items="states"
          item-text="state"
          item-value="state"
          @change="selectState($event)"
        ></v-combobox>

        <v-combobox
          v-model="cityValue"
          outlined
          dense
          clearable
          label="Municipio"
          :items="cities"
          item-text="city"
          item-value="city"
          @change="selectCity($event)"
        ></v-combobox>
      </div>
      <div class="section">
        <p>Tiempo</p>
        <v-radio-group class="radiogroup" v-model="radioGroup" row>
          <v-radio value="period" label="Periodo"></v-radio>
          <v-radio value="absolute" label="Absoluto"></v-radio>
        </v-radio-group>
        <template v-if="radioGroup === 'period'">
          <small>Último:</small>
          <div class="period">
            <v-text-field
              class="input-number"
              v-model="period.number"
              :min="1"
              outlined
              dense
              type="number"
              @input="onChangePeriod"
            ></v-text-field>
            <v-combobox
              :items="period.items"
              v-model="period.selected"
              item-text="text"
              item-value="value"
              outlined
              dense
              @change="onChangePeriod"
            ></v-combobox>
          </div>
        </template>
        <template v-else>
          <v-dialog
            ref="dialogFrom"
            v-model="modalFrom"
            :return-value.sync="form.start_date"
            persistent
            width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="form.start_date"
                label="From"
                prepend-inner-icon="mdi-calendar"
                outlined
                dense
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="form.start_date"
              :max="form.end_date"
              scrollable
            >
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="modalFrom = false">
                Cancel
              </v-btn>
              <v-btn
                text
                color="primary"
                @click="$refs.dialogFrom.save(form.start_date)"
              >
                OK
              </v-btn>
            </v-date-picker>
          </v-dialog>
          <v-dialog
            ref="dialogTo"
            v-model="modalTo"
            :return-value.sync="form.end_date"
            persistent
            width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="form.end_date"
                label="To"
                prepend-inner-icon="mdi-calendar"
                outlined
                dense
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="form.end_date"
              :min="form.start_date"
              :max="today"
              scrollable
            >
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="modalTo = false">
                Cancel
              </v-btn>
              <v-btn
                text
                color="primary"
                @click="$refs.dialogTo.save(form.end_date)"
              >
                OK
              </v-btn>
            </v-date-picker>
          </v-dialog>
        </template>
      </div>
      <div class="section">
        <p>Zona horaria</p>
        <v-combobox
          :items="offsets"
          v-model="form.utc_offset"
          outlined
          dense
          label="UTC Offset"
        ></v-combobox>
      </div>
      <v-btn 
        class="btn-secondary" 
        type="submit"
        :disabled="!isFormValid"
        :loading="loading"
      >
        Buscar
      </v-btn>
    </v-form>
  </v-card>
</template>

<script>
import moment from "moment";
import { findStates } from "@/services/location/find-states";
import { findCities } from "@/services/location/find-cities";

export default {
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    value(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.loading = newValue
      }
    },
    radioGroup(newState) {
      if (newState !== "period") return;
      this.onChangePeriod();
    }
  },
  data() {
    return {
      loading: false,
      modalFrom: false,
      modalTo: false,
      today: moment().format("YYYY-MM-DD"),
      form: {
        start_date: moment().subtract(1, "year").format("YYYY-MM-DD"),
        end_date: moment().format("YYYY-MM-DD"),
        state: null,
        city: null,
        utc_offset: "-05:00"
      },
      states: [],
      stateValue: null,
      cities: [],
      cityValue: null,
      radioGroup: "period",
      period: {
        items: [
          { text: "Hora", value: "hour" },
          { text: "Día", value: "day" },
          { text: "Semana", value: "week" },
          { text: "Mes", value: "month" },
          { text: "Año", value: "year" },
        ],
        selected: { text: "Año", value: "year" },
        number: 1,
      },
      offsets: ["+00:00", "-05:00"],
    };
  },
  computed: {
    isFormValid () {
      const { start_date, end_date, state, city, utc_offset } = this.form

      if (!start_date || !end_date) return false
      if (!state && !city) return false
      if (!utc_offset) return false

      return true
    }
  },
  methods: {
    async selectState(state) {
      if (!state || typeof state === "string") return

      if (!!state.district) {
        this.cities = []
        this.cityValue = null
        this.form.state = null
        this.form.city = state.state
      } else{
        this.form.state = state.state
        this.form.city = null
        this.cityValue = null
        this.cities = await findCities(state.state);
      }

      this.$emit("stateSelected", state)
    },
    selectCity(city) {
      if (city === null) {
        this.form.city = null
        this.cityValue = null
        this.$emit("stateSelected", this.stateValue)
      }

      if (!city || typeof city === "string") return
      
      this.form.city = city.city
      this.$emit("citySelected", city)
    },
    onChangePeriod() {
      const { number, selected } = this.period;
      const start_date = moment()
        .subtract(number, selected.value)
        .format("YYYY-MM-DD");
      const end_date = moment().format("YYYY-MM-DD");
      
      this.form.start_date = start_date;
      this.form.end_date = end_date;
    },
    onSubmit() {
      if (this.isFormValid && !this.loading) {
        this.$emit("submitted", this.form)
      }
    }
  },
  async created() {
    const states = await findStates();
    this.states = states;
    this.listStates = states.map((state) => state.state);
  },
};
</script>

<style lang="scss" scoped>
@import "src/main.scss";

.filter {
  width: 300px; 

  p {
    margin-bottom: 0.5rem;
  }

  p, small {
    color: rgba(0, 0, 0, 0.8);
  }

  .title {
    background-color: var(--primary-alt);
    color: var(--light);
  }

  @include up-to-tablet-landscape {
    width: 100%;
  }
}

.form {
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
  padding: 1rem;

  @include up-to-tablet-landscape {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    row-gap: 0;
    column-gap: 1rem;
  }

  @include up-to-tablet-portrait {
    grid-template-columns: repeat(2, 1fr);
  }

  @include for-phone-only {
    display: flex;
    align-items: stretch;
  }

  .radiogroup {
    margin-top: 0;
  }

  .btn-secondary {
    width: 100%;
    align-self: center;
    @include up-to-tablet-landscape {
      grid-column: 2;
    }
  }

  .period {
    display: flex;
    gap: 0.5rem;

    .input-number {
      max-width: 60px;
    }
  }
}
</style>
