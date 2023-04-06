<template>
  <main class="container">
    <Filters v-model="loading" @submitted="onSubmitFilter($event)" />
    <div v-if="total > 0" class="grid">
      <v-card class="card-chart kpi">
        <div>
          <div>Mayor tiempo del día</div>
          <p class="text-h4 text--primary">
            {{ translateTimeofDay(mostTimeOfDay.name)}}
          </p>
        </div>
        <div class="card-list">
          <div class="item">
            <v-icon>mdi-counter</v-icon>
            <p>{{ mostTimeOfDay.total | formatNumberWithPrefix }}</p>
          </div>
          <div class="item">
            <v-icon>mdi-chart-arc</v-icon>
            <p>{{ calcPercent(mostTimeOfDay.total) }}%</p>
          </div>
        </div>
      </v-card>
      <v-card class="card-chart kpi">
        <div>
          <div>Total de flashes</div>
          <p class="text-h4 text--primary">
            {{ total.toLocaleString() }}
          </p>
        </div>
      </v-card>
      <v-card class="card-chart kpi">
        <div>
          <div>Mayor periodo de actividad</div>
          <p class="text-h4 text--primary">
            {{ translateMonth(mostActivity.month) + " " + mostActivity.year }}
          </p>
        </div>
        <div class="card-list">
          <div class="item">
            <v-icon>mdi-counter</v-icon>
            <p>{{ mostActivity.total | formatNumberWithPrefix }}</p>
          </div>
          <div class="item">
            <v-icon>mdi-chart-arc</v-icon>
            <p>{{ calcPercent(mostActivity.total) }}%</p>
          </div>
        </div>
      </v-card>
      <v-card class="card-chart">
        <BarChart
          class="chart"
          :labels="hours.labels"
          :data="hours.data"
          :series="['Flashes']"
          :horizontal="true"
        />
      </v-card>
      <v-card class="card-chart location">
        <CircleChart
          class="chart"
          type="donut"
          :others="true"
          :labels="location.labels"
          :data="location.data"
        />
      </v-card>
      <v-card class="card-chart">
        <BarChart
          class="chart"
          :labels="years.labels"
          :data="years.data"
          :series="['Flashes']"
          backgroundColor="rgb(79, 144, 255, 0.5)"
          borderColor="rgb(79, 144, 255, 0.8)"
        />
      </v-card>
      <v-card class="card-chart">
        <CircleChart
          class="chart"
          :labels="timesOfDay.labels"
          :data="timesOfDay.data"
        />
      </v-card>
    </div>
    <div v-else class="no-data">
      <Loader 
        v-if="loading"
        message="Cargando datos..."
      />
      <template v-else>
        <v-icon x-large>mdi-information-slab-circle</v-icon>
        <p>No hay información disponible</p>
      </template>
    </div>
  </main>
</template>

<script>
import Filters from "@/components/Filters.vue";
import Loader from "@/components/Loader.vue";
import BarChart from "@/components/BarChart.vue";
import CircleChart from "@/components/CircleChart.vue";

import { getInsights } from "@/services/flash";
import { formatNumberWithSuffix } from "@/utils/number-formatter";

export default {
  components: {
    Filters,
    Loader,
    BarChart,
    CircleChart,
  },
  data: () => ({
    loading: false,
    total: 0,
    mostActivity: { year: "", month: "", total: 0 },
    years: { labels: [], data: [] },
    hours: { labels: [], data: [] },
    timesOfDay: { labels: [], data: [] },
    mostTimeOfDay: { name: "", total: 0 },
    location: { labels: [], data: [] },
  }),
  filters: {
    formatNumberWithPrefix: formatNumberWithSuffix
  },
  methods: {
    clearData() {
      this.total = 0;
      this.mostActivity = { year: "", month: "", total: 0 };
      this.years = { labels: [], data: [] };
      this.hours = { labels: [], data: [] };
      this.timesOfDay = { labels: [], data: [] };
      this.mostTimeOfDay = { name: "", total: 0 };
      this.location = { labels: [], data: [] };
    },

    translateTimeofDay(timeOfDay) {
      if (timeOfDay === "Early morning") return "Madrugada"
      if (timeOfDay === "Morning") return "Mañana"
      if (timeOfDay === "Afternoon") return "Tarde"
      if (timeOfDay === "Evening") return "Noche"

      return timeOfDay
    },

    translateMonth(month) {
      if (month === "Jan") return "Ene"
      if (month === "Apr") return "Abr"
      if (month === "Aug") return "Ago"

      return month
    },

    async onSubmitFilter(filter) {
      this.clearData();
      this.loading = true;

      try {
        const { total, time, location } = await getInsights(filter);

        this.total = total;

        this.mostActivity = time.most_activity;

        this.years.labels = Object.keys(time.years);
        this.years.data = Object.values(time.years).map((year) => year.total);

        this.hours.labels = Object.keys(time.hours);
        this.hours.data = Object.values(time.hours);

        this.timesOfDay.labels = Object.keys(time.times_of_day).map(time => this.translateTimeofDay(time));
        this.timesOfDay.data = Object.values(time.times_of_day);

        this.mostTimeOfDay = time.most_time_of_day;

        this.location.labels = Object.keys(location);
        this.location.data = Object.values(location);
      } catch (err) {
        // nothing
      } finally {
        this.loading = false;
      }
    },
    calcPercent: function (num) {
      const calc = (100 * num) / this.total;
      return calc < 100 ? calc.toFixed(1) : calc;
    },
  },
  created() {
    // this.onSubmitFilter({
    //   start_date: "2022-09-01",
    //   end_date: "2022-11-01",
    //   state: "Cundinamarca",
    //   utc_offset: "-05:00",
    // });
  },
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

.no-data {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: rgba(0, 0, 0, 0.6);
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  justify-content: center;
  align-items: start;
  gap: 1rem;
  width: 100%;

  @include up-to-tablet-landscape {
    grid-template-columns: repeat(2, 1fr);
    align-items: stretch;
  }

  @include up-to-tablet-portrait {
    display: flex;
    flex-direction: column;
  }

  .kpi {
    justify-content: center;

    @include up-to-tablet-landscape {
      justify-content: space-between;
    }

    @include for-big-desktop-up {
      justify-content: space-between;
    }
  }

  .card-chart {
    display: flex;
    padding: 2rem;

    @include for-phone-only {
      flex-direction: column;
      gap: 0.5rem;
      width: 100%;
      padding: 1.5rem;
    }

    @include for-desktop-up {
      flex-direction: column;
      gap: 0.5rem;
    }

    @include for-big-desktop-up {
      flex-direction: row;
    }

    &.location {
      grid-column-start: 2;
      grid-row: 2 / 4;
    }

    p {
      margin: 0;
    }

    div {
      color: rgba(0, 0, 0, 0.6) !important;
    }

    .chart {
      max-width: 100%;
    }
  }

  .card-list {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;

    @include for-phone-only {
      flex-direction: row;
    }

    @include for-desktop-up {
      flex-direction: row;
    }

    @include for-big-desktop-up {
      flex-direction: column;
    }

    .item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  }
}
</style>
