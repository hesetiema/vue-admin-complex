<template>
  <div :class="classname" :style="{ height: height, width: width }"></div>
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons");
import resize from "./mixins/resize";

export default {
  mixins: [resize],
  props: {
    classname: {
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
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null
    };
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val);
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, "macarons");
      this.setOptions(this.chartData);
    },
    setOptions({ expectedData, actualData } = {}) {
      this.chart.setOption({
        legend: {
          data: ["expected", "actual"]
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        xAxis: {
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross"
          },
          padding: [5, 10]
        },
        series: [
          {
            type: "line",
            name: "expected",
            itemStyle: {
              color: "#FF005A"
            },
            lineStyle: {
              color: "#FF005A",
              width: 2
            },
            smooth: true,
            data: expectedData,
            animationDuration: 2800,
            animationEasing: "cubicInOut"
          },
          {
            type: "line",
            name: "actual",
            itemStyle: {
              color: "#3888fa"
            },
            lineStyle: {
              color: "#3888fa",
              width: 2
            },
            areaStyle: {
              color: "#f3f8ff"
            },
            smooth: true,
            data: actualData,
            animationDuration: 2800,
            animationEasing: "quadraticOut"
          }
        ]
      });
    }
  }
};
</script>
