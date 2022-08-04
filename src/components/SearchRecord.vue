<template>
  <div class="mt-2 mb-1 position-relative d-none d-sm-block mx-auto" style="height: 10vh; width: 95%">
    <p class="fs-5 ms-2 text-black mt-1 ms-0 mb-1 font-weight-bolder font-monospace">当前链接:</p>
    <input type="text" v-model="inputValue" class="form-control form-control-md ms-2" style="width: 85%" name="url"/>
  </div>
  <div class="mt-2 position-relative mx-auto" style="height: 40vh; width: 95%">
    <div class="container">
      <div class="row row-cols-1">
        <div class="col mx-auto px-0" style="height: 40vh;" id="chart"></div>
      </div>
    </div>
  </div>
</template>

<script>

import * as echarts from "echarts";

export default {
  name: "search_record",
  props: ['recordValue', 'recordUrl'],
  data() {
    return {
      inputValue: this.recordUrl,
      option: {
        color: ['#80FFA5', '#00DDFF', '#37A2FF'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          data: ['Electric (度)', 'ColdWater (吨)', 'HotWater (吨)']
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: []
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: 'Electric (度)',
            type: 'line',
            stack: 'Total',
            smooth: true,
            lineStyle: {
              width: 0
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgb(128, 255, 165)'
                },
                {
                  offset: 1,
                  color: 'rgb(1, 191, 236)'
                }
              ])
            },
            emphasis: {
              focus: 'series'
            },
            data: []
          },
          {
            name: 'ColdWater (吨)',
            type: 'line',
            stack: 'Total',
            smooth: true,
            lineStyle: {
              width: 0
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgb(0, 221, 255)'
                },
                {
                  offset: 1,
                  color: 'rgb(77, 119, 255)'
                }
              ])
            },
            emphasis: {
              focus: 'series'
            },
            data: []
          },
          {
            name: 'HotWater (吨)',
            type: 'line',
            stack: 'Total',
            smooth: true,
            lineStyle: {
              width: 0
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgb(55, 162, 255)'
                },
                {
                  offset: 1,
                  color: 'rgb(116, 21, 219)'
                }
              ])
            },
            emphasis: {
              focus: 'series'
            },
            data: []
          },
        ]
      }
    }
  },
  mounted() {
    // 处理x轴
    let betweenDate = this.recordValue.Electric.electricDate.length > this.recordValue.ColdWater.coldWaterDate.length ? this.recordValue.Electric.electricDate : this.recordValue.ColdWater.coldWaterDate
    this.option.xAxis[0].data = (betweenDate.length > this.recordValue.HotWater.hotWaterDate.length ? betweenDate : this.recordValue.HotWater.hotWaterDate).reverse()
    const myChart = echarts.init(document.getElementById('chart'), null, {
      renderer: 'canvas',
      useDirtyRect: false
    });
    // 处理三者数据
    this.option.series[0].data = this.recordValue.Electric.electricInfo
    this.option.series[1].data = this.recordValue.ColdWater.coldWaterInfo
    this.option.series[2].data = this.recordValue.HotWater.hotWaterInfo
    this.option.series[0].data.reverse()
    this.option.series[1].data.reverse()
    this.option.series[2].data.reverse()
    myChart.setOption(this.option);
    window.onresize = function() {
      myChart.resize();
    };
  }
}
</script>