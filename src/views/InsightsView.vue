<template>
  <main>
    <div class="grid">
      <template v-if="loaded">
        <v-card class="card-chart">
          <div>
            <div>Time of day with most activity</div>
            <p class="text-h4 text--primary">
              {{ mostTimeOfDay.name }}
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
        <v-card class="card-chart">
          <div>
            <div>Total of flashes</div>
            <p class="text-h4 text--primary">
              {{ total.toLocaleString() }}
            </p>
          </div>
        </v-card>
        <v-card class="card-chart">
          <div>
            <div>Period with most activity</div>
            <p class="text-h4 text--primary">
              {{ mostActivity.month + " " + mostActivity.year }}
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
      </template>
    </div>
  </main>
</template>

<script>
import BarChart from "@/components/BarChart.vue";
import CircleChart from "@/components/CircleChart.vue";

import { getInsights } from "@/services/flash";
import { formatNumberWithSuffix } from "@/utils/number-formatter";

export default {
  components: {
    BarChart,
    CircleChart
  },
  data: () => ({
    loaded: false,
    total: 0,
    mostActivity: { year: "", month: "", total: 0 },
    years: { labels: [], data: [] },
    hours: { labels: [], data: [] },
    timesOfDay: { labels: [], data: [] },
    mostTimeOfDay: { name: "", total: 0 },
    location: { labels: [], data: [] }
  }),
  filters: {
    formatNumberWithPrefix: formatNumberWithSuffix,
  },
  methods: {
    async fetchInsights(query) {
      try {
        const insights = await getInsights(query);
        return insights;
      } catch (err) {
        console.log(err);
      }
    },
    calcPercent: function (num) {
      const calc = (100 * num) / this.total;
      return calc < 100 ? calc.toFixed(1) : calc;
    },
  },
  async created() {
    this.loaded = false;

    const { total, time, location } = await this.fetchInsights({
      start_date: "2018-3-15",
      end_date: "2023-10-15",
      state: "Cundinamarca",
    });

    if (total === 0) return;

    this.total = total;

    this.mostActivity = time.most_activity;

    this.years.labels = Object.keys(time.years);
    this.years.data = Object.values(time.years).map((year) => year.total);

    this.hours.labels = Object.keys(time.hours);
    this.hours.data = Object.values(time.hours);

    this.timesOfDay.labels = Object.keys(time.times_of_day);
    this.timesOfDay.data = Object.values(time.times_of_day);

    this.mostTimeOfDay = time.most_time_of_day

    this.location.labels = Object.keys(location);
    this.location.data = Object.values(location);

    this.loaded = true;
  },
};
</script>

<style lang="scss" scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  justify-content: center;
  align-items: start;
  gap: 1rem;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    justify-content: stretch;
  }

  .card-chart {
    display: flex;
    padding: 2rem;
    align-items: center;
    justify-content: space-between;

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: start;
      gap: 0.5rem;
      width: 100%;
    }

    p {
      margin: 0;
    }

    div {
      color: rgba(0, 0, 0, 0.6) !important;
    }
  }

  .card-chart.location {
    grid-column-start: 2;
    grid-row: 2 / 4;
  }

  .card-list {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;

    @media (max-width: 768px) {
      flex-direction: row;
      gap: 1rem;
    }

    .item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  }

  .chart {
    width: 100%;
  }
}
</style>
