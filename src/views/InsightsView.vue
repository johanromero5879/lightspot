<template>
  <main class="container">
    <Filters v-model="loading" @submitted="onSubmitFilter" />
    <div v-if="loaded" class="grid">
      <v-card class="card kpi most-period">
        <div>
          <div>Mayor periodo de actividad</div>
          <p class="text-h4 text--primary">
            {{ `${mostActivity.month} ${mostActivity.year}` }}
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
      <v-card class="card kpi total">
        <div>
          <div>Total de flashes</div>
          <p class="text-h4 text--primary">
            {{ total.toLocaleString() }}
          </p>
        </div>
      </v-card>
      <v-card class="card kpi most-period-of-day">
        <div>
          <div>Mayor periodo del día</div>
          <p class="text-h4 text--primary">
            {{ mostPeriodOfDay.name }}
          </p>
        </div>
        <div class="card-list">
          <div class="item">
            <v-icon>mdi-counter</v-icon>
            <p>{{ mostPeriodOfDay.total | formatNumberWithPrefix }}</p>
          </div>
          <div class="item">
            <v-icon>mdi-chart-arc</v-icon>
            <p>{{ calcPercent(mostPeriodOfDay.total) }}%</p>
          </div>
        </div>
      </v-card>
      <v-card class="card years">
        <BarChart
          class="chart"
          title="Ocurrencias por año"
          :labels="years.labels"
          :data="years.data"
          :series="['Flashes']"
          background-color="rgb(79, 144, 255, 0.5)"
          border-color="rgb(79, 144, 255, 0.8)"
          @barClicked="selectYear"
        />
      </v-card>
      <v-card class="card location">
        <CircleChart
          title="Ocurrencias por municipio"
          subtitle="Categoría Otros: 2% del total por municipio."
          class="chart"
          type="donut"
          :others="true"
          :labels="location.labels"
          :data="location.data"
        />
      </v-card>
      <v-card class="card hours">
        <BarChart
          title="Ocurrencias por hora"
          class="chart"
          :labels="hours.labels"
          :data="hours.data"
          :series="['Flashes']"
          :horizontal="true"
          background-color="rgb(255, 46, 99, 0.5)"
          border-color="rgb(255, 46, 99, 0.8)"
        />
      </v-card>
      <v-card class="card months">
        <BarChart
          class="chart"
          ref="monthsChart"
          :title="months.title"
          :labels="months.labels"
          :data="months.data"
          :series="['Flashes']"
          background-color="rgb(0, 207, 197, 0.5)"
          border-color="rgb(0, 207, 197, 0.8)"
        />
      </v-card>
      <v-card class="card periods_of_day">
        <CircleChart
          title="Ocurrencias por periodo del día"
          class="chart"
          :labels="periodsOfDay.labels"
          :data="periodsOfDay.data"
        />
      </v-card>
    </div>
    <LoaderPanel 
      v-else
      :loading="loading"
      loading-text="Cargando gráficas..." 
      icon="mdi-view-dashboard-outline"
      no-data-text="No hay datos para generar gráficas"
    />
  </main>
</template>

<script>
import { mapActions } from "vuex"

import Filters from "@/components/Filters.vue";
import LoaderPanel from "@/components/LoaderPanel.vue";
import BarChart from "@/components/BarChart.vue";
import CircleChart from "@/components/CircleChart.vue";

import { getInsights } from "@/services/flash";
import { formatNumberWithSuffix } from "@/utils/number-formatter";
import { translateMonth, translatePeriodOfDay } from "@/utils/translator"

export default {
  components: {
    Filters,
    LoaderPanel,
    BarChart,
    CircleChart,
  },
  computed: {
    loaded() {
      return this.total > 0;
    },
  },
  data: () => ({
    loading: false,
    total: 0,
    mostActivity: { year: "", month: "", total: 0 },
    years: { labels: [], data: [] },
    months: { labels: [], data: [], title: "" },
    hours: { labels: [], data: [] },
    periodsOfDay: { labels: [], data: [] },
    mostPeriodOfDay: { name: "", total: 0 },
    location: { labels: [], data: [] },
  }),
  filters: {
    formatNumberWithPrefix: formatNumberWithSuffix,
  },
  methods: {
    ...mapActions("notifier", ["showNotification"]),
    calcPercent: function (num) {
      const calc = (100 * num) / this.total;
      return calc < 100 ? calc.toFixed(1) : calc;
    },

    selectYear(event) {
      const { label: year, data } = event;
      this.setMonthChart(year, data.months);
    },

    async onSubmitFilter(filter) {
      this.clearData();
      this.loading = true;

      try {
        const { total, time, location } = await getInsights(filter);
        const { most_activity, most_period_of_day, years, hours, periods_of_day } =
          time;

        // Set KPIs
        most_activity.month = translateMonth(most_activity.month)
        this.mostActivity = most_activity;

        most_period_of_day.name = translatePeriodOfDay(most_period_of_day.name)
        this.mostPeriodOfDay = most_period_of_day;

        // Set charts
        this.setYearsChart(years);
        this.setHoursChart(hours);
        this.setPeriodsOfDayChart(periods_of_day);
        this.setLocationChart(location);

        this.total = total;
      } catch (err) {
        this.showNotification({
          type: "error",
          message: err.message
        })
      } finally {
        this.loading = false;
      }
    },

    clearData() {
      this.total = 0;
    },

    setYearsChart(years) {
      this.years.labels = Object.keys(years);

      const data = [];
      for (let [year, { total, months }] of Object.entries(years)) {
        data.push({
          x: year,
          y: total,
          months: months,
        });
      }

      const lastYear = data[data.length - 1];
      this.setMonthChart(lastYear.x, lastYear.months);
      this.years.data = data;
    },

    setMonthChart(year, months) {
      this.months.title = `Ocurrencias registradas en ${year}`;

      this.months.labels = Object.keys(months).map((label) =>
        translateMonth(label)
      );
      this.months.data = Object.values(months);
    },

    setHoursChart(hours) {
      this.hours.labels = Object.keys(hours);
      this.hours.data = Object.values(hours);
    },

    setPeriodsOfDayChart(periodsOfDay) {
      this.periodsOfDay.labels = Object.keys(periodsOfDay).map((time) =>
        translatePeriodOfDay(time)
      );
      this.periodsOfDay.data = Object.values(periodsOfDay);
    },

    setLocationChart(location) {
      this.location.labels = Object.keys(location);
      this.location.data = Object.values(location);
    },
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

.grid {
  display: grid;
  justify-content: center;
  align-items: flex-start;
  gap: 1rem;
  width: 100%;

  @include for-big-desktop-up {
    grid-template-columns: repeat(3, 1fr);

    .months {
      grid-column: 1 / 3;
    }
  }

  @include up-to-desktop {
    grid-template-columns: repeat(2, 1fr);

    .location {
      grid-column: 2;
      grid-row: 1 / 4;
    }

    .months {
      grid-column: 2;
      grid-row: 4;
    }
    
  }

  @include up-to-tablet-portrait {
    display: flex;
    flex-direction: column;

    .total { order: 1 }
    .most-period { order: 2 }
    .most-period-of-day { order: 3 }
    .years { order: 4 }
    .months { order: 5 }
    .location { order: 6 }
    .hours { order: 7 }
    .periods_of_day { order: 8 }
  }

  .kpi {
    justify-content: center;
    align-items: flex-start;

    @include up-to-tablet-landscape {
      justify-content: space-between;
      align-items: center;
    }

    @include for-big-desktop-up {
      justify-content: space-between;
      align-items: center;
    }

    @include for-phone-only {
      justify-content: center;
    }
  }

  .card {
    display: flex;
    padding: 2rem;
    align-self: stretch;

    @include for-phone-only {
      flex-direction: column;
      gap: 0.5rem;
      width: 100%;
      padding: 1.5rem;
      align-items: flex-start;
    }

    @include for-desktop-up {
      flex-direction: column;
      gap: 0.5rem;
    }

    @include for-big-desktop-up {
      flex-direction: row;
    }

    p {
      margin: 0;
    }

    div {
      color: rgba(0, 0, 0, 0.6) !important;
    }

    .chart {
      max-width: 100%;
      height: 300px;
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
