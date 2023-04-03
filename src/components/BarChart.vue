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
    backgroundColor: {
      type: String,
      default: "rgb(0, 207, 197, 0.5)"
    },
    borderColor: {
      type: String,
      default: "rgb(0, 207, 197, 0.8)"
    },
    horizontal: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      chartData: {
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
      },

      options: {
        indexAxis: this.horizontal ? "y" : "x",
        responsive: true,
        maintainAspectRatio: false
      },
    };
  },
  created() {},
};
</script>

<style lang="scss" scoped></style>
