<template>
  <div class="mt-4 mb-2 position-relative d-none d-sm-block mx-auto" style="height: 10vh; width: 95%">
    <p class="fs-5 ms-2 text-black mt-1 ms-0 mb-1 font-weight-bolder font-monospace">当前链接:</p>
    <input type="text" v-model="inputValue" class="form-control form-control-md ms-2" style="width: 85%" name="url"/>
  </div>
  <span class="text-black fs-5 font-weight-bolder font-monospace mx-auto mt-3 mb-1">近一日的访问量</span>
  <div class="position-relative mx-auto mb-1" style="height: 35vh;width: 95%" id="chart">
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: "search_default",
  props: ['defaultValue', 'defaultUrl'],
  data() {
    return {
      inputValue: this.defaultUrl,
      option: {
        xAxis: {
          type: 'category',
          data: []
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [],
            type: 'line',
            smooth: true
          }
        ]
      }
    }
  },
  methods: {
    initEcharts() {
      // 要从原来的到现在进行取反
      this.option.xAxis.data  = this.defaultValue.map(function (value) {
        return value[0]
      }).reverse()
      this.option.series[0].data = this.defaultValue.map(function (value) {
        return value[1]
      }).reverse()
      const myChart = echarts.init(document.getElementById("chart"));// 图标初始化
      myChart.setOption(this.option);// 渲染页面
      window.onresize = function() {
        myChart.resize();
      };
    }
  },
  mounted() {
    this.initEcharts()
  },
  beforeUnmount() {
    document.getElementById('chart').removeAttribute('_echarts_instance_');
  }
}
</script>