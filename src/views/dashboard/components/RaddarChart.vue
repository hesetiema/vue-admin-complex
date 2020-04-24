<template>
  <div :class="className" :style="{ height: height, width: width }"></div>
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons");
import resize from "./mixins/resize";

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: "chart"
    },
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "20rem"
    }
  },
  data() {
    return {
      chart: null
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, "macarons");
      this.chart.setOption({
        legend: {
          left: "center",
          bottom: "10",
          data: ["A", "B", "C"]
        },
        radar: {
          center: ["50%", "45%"],
          radius: "66%",
          splitNumber: 6,
          splitArea: {
            areaStyle: {
              color: "rgba(127,95,132,.3)",
              opacity: 1,
              shadowBlur: 45,
              shadowColor: "rgba(0,0,0,.5)",
              shadowOffsetX: 0,
              shadowOffsetY: 15
            }
          },
          indicator: [
            { name: "Sales", max: 10000 },
            { name: "Administration", max: 20000 },
            { name: "Info Tech", max: 20000 },
            { name: "Custom Sup", max: 20000 },
            { name: "Development", max: 20000 },
            { name: "Marketing", max: 20000 }
          ]
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        series: [{
          type: "radar",
          symbolSize: 0,
          areaStyle: {
            shadowBlur: 13,
            shadowColor: "rgba(0,0,0,.2)",
            shadowOffsetX: 0,
            shadowOffsetY: 10,
            opacity: 1
          },
          data: [
            {
              value: [5000, 7000, 12000, 11000, 15000, 14000],
              name: "A"
            },
            {
              value: [4000, 9000, 15000, 15000, 13000, 11000],
              name: "B"
            },
            {
              value: [5500, 11000, 12000, 15000, 12000, 12000],
              name: "C"
            }
          ],
          animationDuration: 3000

        }]
      })
    }
  }
}
</script>
