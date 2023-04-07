<template>
  <Doughnut v-if="type === 'donut'" :options="chartOptions" :data="chartData" />
  <Pie v-else :options="chartOptions" :data="chartData" />
</template>

<script>
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  SubTitle
} from "chart.js";
import { Pie, Doughnut } from "vue-chartjs";

ChartJS.register(ArcElement, Tooltip, Legend, Title, SubTitle);

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
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      required: null,
    },
    others: {
      type: Boolean,
      default: false,
    },
    colors: {
      type: Array,
      default: () => [
        "#2F55EB",
        "#9966ff",
        "#ffcd56",
        "#4bc0c0",
        "#ff9f40",
        "#ff6384",
        "#4F9E00",
        "#36a2eb",
        "#9E9D08",
        "#EB510C",
      ],
    },
  },
  data() {
    return {
      max: 0,
      chartData: {
        labels: [],
        datasets: [
          {
            backgroundColor: this.type === "donut" ? this.colors : this.colors,
            data: [],
          },
        ],
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "left",
          },
          title: {
            display: true,
            text: this.title,
            padding: {
              bottom: 24,
            },
          },
          subtitle: {
            display: !!this.subtitle,
            text: this.subtitle,
            position: "bottom",
            padding: {
              top: 24,
            },
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
      this.max = this.data.reduce((sum, value) => sum + value, 0);

      if (this.others) {
        return this.setOthers();
      }

      this.chartData.labels = this.labels;
      this.chartData.datasets[0].data = this.data;
    },
    setOthers() {
      // Define the threshold value as a percentage of the max sum of data points
      const threshold = 0.02;
      const thresholdValue = this.max * threshold;

      // Initialize variables for the new "Others" category
      let othersValue = 0;
      let othersLabel = "Otros";
      let othersColor = "#c9cbcf";

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
