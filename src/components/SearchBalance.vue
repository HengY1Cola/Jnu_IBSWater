<template>
  <div class="mt-2 mb-1 position-relative d-none d-sm-block mx-auto" style="height: 10vh; width: 95%">
    <p class="fs-5 ms-2 text-black mt-1 ms-0 mb-1 font-weight-bolder font-monospace">当前链接:</p>
    <input type="text" v-model="inputValue" class="form-control form-control-md ms-2" style="width: 85%" name="url"/>
  </div>
  <div class="mt-4 position-relative mx-auto d-none d-sm-block" style="width: 95%">
    <p class="fs-6 text-black text-center my-0 font-weight-bolder font-monospace">{{balance.notice}}</p>
  </div>
  <div class="mt-2 position-relative mx-auto" style="height: 40vh; width: 95%">
    <div class="container">
      <div class="row row-cols-1">
        <div class="col mt-2" style="height: 8vh;">
          <div class="progress-wrapper">
            <div class="progress-info">
              <div class="progress-label">
                <span class="font-weight-bolder font-monospace">剩余余额</span>
              </div>
              <div class="progress-percentage">
                <span class="font-weight-bolder font-monospace">{{balance.balance + " 元"}}</span>
              </div>
            </div>
            <div class="progress">
              <div class="progress-bar bg-primary" role="progressbar" :aria-valuenow="balance.balance / 500" aria-valuemin="0" aria-valuemax="500" :style="`width: ${balance.balance / 5}%`"></div>
            </div>
          </div>

        </div>
        <div class="col mx-auto px-0" style="height: 32vh;" id="chart2"></div>
      </div>
    </div>
  </div>
</template>

<script>

import * as echarts from "echarts";

export default {
  name: "search_balance",
  props: ['balanceValue', 'balanceUrl'],
  data() {
    return {
      inputValue: this.balanceUrl,
      balance: this.balanceValue,
    }
  },
  mounted() {
    const myChart = echarts.init(document.getElementById('chart2'), null, {
      renderer: 'canvas',
      useDirtyRect: false
    });
    const gaugeData = [
      {
        value: (this.balance.electricitySubsidy / 40).toFixed(2) * 100,
        name: '电补',
        title: {
          offsetCenter: ['-30%', '-30%']
        },
        detail: {
          valueAnimation: true,
          offsetCenter: ['25%', '-30%']
        }
      },
      {
        value: (this.balance.coldSubsidy / 10).toFixed(2) * 100,
        name: '冷补',
        title: {
          offsetCenter: ['-30%', '0%']
        },
        detail: {
          valueAnimation: true,
          offsetCenter: ['25%', '0%']
        }
      },
      {
        value: (this.balance.hotSubsidy / 10).toFixed(2) * 100,
        name: '热水',
        title: {
          offsetCenter: ['-30%', '30%']
        },
        detail: {
          valueAnimation: true,
          offsetCenter: ['25%', '30%']
        }
      }
    ];
    const option = {
      series: [
        {
          type: 'gauge',
          startAngle: 90,
          endAngle: -270,
          pointer: {
            show: false
          },
          progress: {
            show: true,
            overlap: false,
            roundCap: true,
            clip: false,
          },
          axisLine: {
            lineStyle: {
              width: 30
            }
          },
          splitLine: {
            show: false,
            distance: 0,
            length: 10
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: false,
            distance: 50
          },
          data: gaugeData,
          title: {
            fontSize: 14
          },
          detail: {
            width: 50,
            height: 14,
            fontSize: 14,
            color: 'auto',
            borderColor: 'auto',
            borderRadius: 20,
            borderWidth: 1,
            formatter: '{value}%'
          }
        }
      ]
    };
    myChart.setOption({
      series: [
        {
          data: gaugeData,
          pointer: {
            show: false
          }
        }
      ]
    })
    myChart.setOption(option);
    window.onresize = function() {
      myChart.resize();
    };
  },
  beforeUnmount() {
    document.getElementById('chart2').removeAttribute('_echarts_instance_');
  }
}
</script>