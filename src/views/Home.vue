<template>
  <main class="mt-0 main-content">
    <section>
      <div class="page-header min-vh-100">
        <div class="container">
            <div class="row row-cols-1 row-cols-sm-2">
              <div class="col min-vh-25 d-flex flex-column justify-content-end">
                <div class="h-25 mb-3">
                  <div class="h-50 position-relative">
                    <p class="fs-5 mb-0 font-weight-bolder font-monospace position-relative" style="color: #51dbbc">HengY1Service</p>
                    <p class="fs-2 mb-0 font-weight-bolder font-monospace position-relative d-inline">暨南大学</p>
                    <span class="fs-2 mb-0 font-weight-bolder font-monospace position-relative" style="color: #50d5bd">水电费查询</span>
                  </div>
                  <div class="h-50 d-none d-sm-block position-relative">
                    <p class="fs-5 mb-0 font-weight-bolder font-monospace d-inline">取其所需，对"</p>
                    <span class="fs-5 mb-0 font-weight-bolder font-monospace d-inline" style="color: #51dbbc">宿舍能耗查询系统</span>
                    <p class="fs-5 mb-0 font-weight-bolder font-monospace d-inline">"二次封装</p>
                    <p class="fs-5 mb-0 font-weight-bolder font-monospace">面向第三方提供查询、通知等服务</p>
                  </div>
                </div>
                <div
                    class="h-50 my-3 d-none d-sm-block"
                    :style="`background-image:url(${bgImg});background-size: contain;background-repeat: no-repeat;background-position:center`">
                </div>
              </div>
              <div class="col">
                <div class="min-vh-25 d-none d-sm-block">
                </div>
                <div class="min-vh-75 position-relative">
                  <div class="position-absolute w-100 start-0 d-none d-sm-block" style="height:10%;top: 0">
                    <div class="position-absolute top-50 start-0 translate-middle-y fs-6 font-weight-bolder font-monospace d-inline">
                      当前下游服务器状态为:
                      <i class="fa fa-circle" :style="`color: ${status? '#28a745' : '#dc3545'}`"></i>
                      <span>{{status ? "   已连接" : "   已宕机"}}</span>
                    </div>
                  </div>
                  <div class="position-absolute w-100 start-0 bg-danger shadow-sm bg-white rounded " style="height:45%;top: 10%">
                    <div class="container position-absolute top-50 start-50 translate-middle">
                      <div class="row">
                        <div class="col-6">
                          <default-info-card
                              :classIcon="daysNum.classIcon"
                              :title="daysNum.title"
                              :desc="daysNum.desc"
                              :price="daysNum.price"
                          />
                        </div>
                        <div class="col-6">
                          <default-info-card
                              :classIcon="smsNum.classIcon"
                              :title="smsNum.title"
                              :desc="smsNum.desc"
                              :price="smsNum.price"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="position-absolute w-100 start-0 bg-default shadow-sm bg-white rounded" style="height:40%;top: 57%">
                    <div class="position-absolute top-50 start-0" style="transform: translateY(-50%)">
                      <p v-for="(item, index) in pInfo" :key="index" :class="item.flag ? pClass[1] : pClass[0]">{{"● " + item.msg}}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import bgImg from "@/assets/img/home.png"
import DefaultInfoCard from "@/components/DefaultInfoCard";
import { homeMsg } from "@/request/api"
import Swal from 'sweetalert2'
const body = document.getElementsByTagName("body")[0];

export default {
  name: "home",
  components: {
    DefaultInfoCard,
  },
  data() {
    return {
      bgImg,
      status: true,
      daysNum: {
        classIcon: "text-white fa fa-globe",
        title: "运行天数",
        desc: "安稳维护",
      },
      smsNum: {
        classIcon: "text-white fa fa-pie-chart",
        title: "通知人数",
        desc: "使用短信通知服务",
      },
      pInfo: [
        {msg: `“宿舍能耗查询系统”只能校园网内才能访问。`, flag: false},
        {msg: `本服务使用了开源工具 frp 进行内网穿透，提供了公网的使用的可能性。`, flag: false},
        {msg: `本服务不会收集任何个人信息，只是提供一个中转类的服务。`, flag: false},
        {msg: `服务QPS限制为50次/s；每个IP为100次/h，同时存在黑白名单。`, flag: true},
        {msg: `查询后余额结果缓存时效为6小时；查询后消费记录缓存时效为1天。`, flag: true},
        {msg: `本项目遵循 MIT license 开源协议，请注明来源并同时遵循相关协议。`, flag: false},
        {msg: `本项目的最后解释权由本人（HengY1）所有。`, flag: false}
      ],
      pClass: [
          "ms-3 mb-0 fs-6 font-weight-bolder font-monospace text-black d-none d-sm-block",
          "ms-3 mb-0 fs-6 font-weight-bolder font-monospace text-black"
      ]
    }
  },
  created() {
    body.classList.remove("bg-gray-100");
  },
  methods: {
      getBaseInfo() {
        homeMsg().then(res => {
          this.status = res.data.status
          this.daysNum.price = res.data.sub_day.toString() + " 天"
          this.smsNum.price = res.data.users.toString() + " 人"
        }).catch(err => {
          console.log(err.errmsg)
          this.status = false
          this.daysNum.price = "-1 天"
          this.smsNum.price = "-1 人"
          Swal.fire({
            title: '哎妈呀～ 网络不对劲',
            text: `错误原因：${err.errmsg.substring(0, 8) + (8 < err.errmsg.length ? "..." : "")}`,
            icon: 'error',
            confirmButtonText: '关闭继续'
          })
        })
      }
  },
  mounted() {
    this.getBaseInfo()
    Swal.fire({
      icon: 'info',
      title: '在线充值',
      text: '官方已经提供在线充值渠道',
      footer: '<a href="https://pay.jnu.edu.cn/jnushouyintai/pyxssssdf/pay">👉 点击在线充值</a>'
    })
  }
};
</script>
