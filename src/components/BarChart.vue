<template>
  <Bar :data="chartData" :options="options" />
</template>

<script>
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

export default {
  components: {
    Bar,
  },
  props: {
    labels: {
      type: Array,
      required: true,
    },
    data: {
      type: Array,
      required: true,
    },
    series: {
      type: Array,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    backgroundColor: {
      type: String,
    },
    borderColor: {
      type: String,
    },
    horizontal: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    chartData() {
      return {
        labels: this.labels,
        datasets: [
          {
            label: "Flashes",
            backgroundColor: this.backgroundColor,
            borderColor: this.borderColor,
            borderWidth: 1,
            data: this.data,
          },
        ],
      };
    },
    options() {
      return {
        indexAxis: this.horizontal ? "y" : "x",
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
          },
          title: {
            display: true,
            text: this.title,
            padding: {
              bottom: 16,
            },
          },
        },
        onClick: this.getBarSelected,
      }
    }
  },
  methods: {
    getBarSelected(event) {
      const chart = event.chart;

      const points = chart.getElementsAtEventForMode(
        event,
        "nearest",
        { intersect: true },
        true
      );

      if (points.length == 0) return;

      const firstPoint = points[0];
      const label = chart.data.labels[firstPoint.index];
      const data =
        chart.data.datasets[firstPoint.datasetIndex].data[firstPoint.index];

      this.onBarClick(label, data);
    },
    onBarClick(label, data) {
      this.$emit("barClicked", { label, data });
    },
  },
};
</script>

<style lang="scss" scoped></style>
