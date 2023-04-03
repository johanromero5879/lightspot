<template>
  <Doughnut v-if="type === 'donut'" :options="chartOptions" :data="chartData" />
  <Pie v-else :options="chartOptions" :data="chartData" />
</template>

<script>
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie, Doughnut } from "vue-chartjs";

ChartJS.register(ArcElement, Tooltip, Legend);

export default {
  components: {
    Pie,
    Doughnut,
  },
  props: {
    type: {
      type: String,
      default: "pie",
    },
    labels: {
      type: Array,
      required: true,
    },
    data: {
      type: Array,
      required: true,
    },
    others: {
      type: Boolean,
      default: false,
    },
    colors: {
      type: Array,
      default: () => ["#0D3882", "#4F90FF", "#3073E6", "#00CFC5", "#4FFFF6", "#30E6DC"]
    }
  },
  data() {
    return {
      chartData: {
        labels: [],
        datasets: [
          {
            backgroundColor: this.type === "donut" ? this.colors : this.colors.reverse(),
            data: [],
          },
        ],
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "right",
            align: "start",
          },
        },
      },
    };
  },
  watch: {
    labels(newState) {
      this.chartData.labels = newState;
    },
  },
  methods: {
    setup() {
      if (this.others) {
        return this.setOthers();
      }

      this.chartData.labels = this.labels;
      this.chartData.datasets[0].data = this.data;
    },
    setOthers() {
      // Define the threshold value as a percentage of the total sum of data points
      const threshold = 0.02;
      const total = this.data.reduce((sum, value) => sum + value, 0);
      const thresholdValue = total * threshold;

      // Initialize variables for the new "Others" category
      let othersValue = 0;
      let othersLabel = "Others";
      let othersColor = "#BDBDBD";

      let colorIndex = 0;

      // Iterate through the data and determine which data points should be consolidated
      const chartData = [];
      const chartLabels = [];
      const backgroundColor = [];
      const colors = [...this.chartData.datasets[0].backgroundColor];

      for (let index = 0; index < this.data.length; index++) {
        if (this.data[index] >= thresholdValue) {
          // Add the data point to the main chart
          chartData.push(this.data[index]);
          chartLabels.push(this.labels[index]);

          backgroundColor.push(colors[colorIndex]);

          // Increment the color index, wrapping around to the beginning of the color array if necessary
          colorIndex = (colorIndex + 1) % colors.length;
        } else {
          // Consolidate the data point into the "Others" category
          othersValue += this.data[index];
        }
      }

      // Add the new "Others" category to the chart data and labels
      if (othersValue > 0) {
        chartData.push(othersValue);
        chartLabels.push(othersLabel);
        backgroundColor.push(othersColor);
      }

      this.chartData.labels = chartLabels;
      this.chartData.datasets[0].data = chartData;
      this.chartData.datasets[0].backgroundColor = backgroundColor;
    },
  },
  created() {
    this.setup();
  },
};
</script>
