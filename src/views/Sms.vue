<template>
  <main class="mt-0 main-content">
    <section>
      <div class="page-header min-vh-100">
        <div class="container">
          <div class="row">
            <div class="mx-auto col-xl-4 col-lg-5 col-md-7 d-flex flex-column mx-lg-0">
              <div class="card card-plain">
                <div class="pb-0 card-header text-start">
                  <h4 class="font-weight-bolder">将手机号与宿舍建立联系</h4>
                  <p class="mb-0">1. 若初次使用，将会自动进行绑定</p>
                  <p class="mb-0">2. 若再次使用，将会覆盖原先手机号绑定</p>
                </div>
                <div class="card-body mt-2">
                  <div id="captcha" style="right: 5%"></div>
                  <form role="form">
                    <div class="row">
                      <div class="col-12">
                        <div class="form-group">
                          <input type="text" v-model="inputDormitory" class="form-control form-control-lg" :class="inputClassDormitoryFlag ? 'is-valid' : 'is-invalid'" name="dormitory" placeholder="输入宿舍号码 例如：T110222"/>
                        </div>
                      </div>
                      <div class="col-12">
                        <div class="form-group">
                          <input type="text" v-model="inputTel" class="form-control form-control-lg" :class="inputClassTelFlag ? 'is-valid' : 'is-invalid'" name="tel" placeholder="输入手机号码"/>
                        </div>
                      </div>
                      <div class="col-8">
                        <div class="form-group">
                          <input type="text" v-model="inputCode" class="form-control form-control-lg" :class="inputClassCodeFlag ? 'is-valid' : 'is-invalid'" name="code" placeholder="输入六位验证码"/>
                        </div>
                      </div>
                      <div class="col-4">
                        <argon-button
                            class="mt-1" variant="gradient" color="secondary" size="md"
                            @click.prevent="showValidate" :disabled="isSend.inWait"
                        > {{isSend.msg}} </argon-button>
                      </div>
                    </div>
                    <div class="col-12">
                      <argon-button
                        class="mt-2" variant="gradient" color="success" fullWidth size="lg" @click.prevent="smsDoMission"
                      >进行绑定</argon-button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div class="top-0 my-auto text-center col-6 d-lg-flex d-none h-100 pe-0 position-absolute end-0 justify-content-center flex-column">
              <div
                class="position-relative h-100 m-3 px-7 border-radius-lg d-flex flex-column justify-content-center overflow-hidden"
                style="background-image: linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)"
              >
                <span class="mask bg-gradient-success opacity-6"></span>
                <div
                    class="bg-gradient-dark h-50 mb-3 position-relative"
                    :style="`background-image:url(${bgImg});background-size: contain;background-repeat: no-repeat;background-position:center`"
                >
                </div>
                <h4
                    class="mt-5 text-white font-weight-bolder align-self-start position-relative"
                >注意事项：</h4>
                <p v-for="(item, index) in pInfo" :key="index" class="text-white font-weight-bolder font-monospace align-self-start position-relative"
                >{{(index + 1) + ". " + item}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import ArgonButton from "@/argon_components/ArgonButton.vue";
import bgImg from "@/assets/img/notice.png"
import { getCode,insertOrUpdate } from "@/request/api"
const body = document.getElementsByTagName("body")[0];
import Swal from 'sweetalert2'

export default {
  name: "sms",
  data() {
    return {
      bgImg,
      isSend: {
        inWait: false,
        msg: "发送"
      },
      token: "",
      inputClassDormitoryFlag: false,
      inputClassCodeFlag: false,
      inputClassTelFlag: false,
      inputDormitory: "",
      inputCode: "",
      inputTel: "",
      pInfo:[
          `将会在每天的 8:00AM 以及 6:00PM 进行定时任务。`,
          `即时若你绑定的余额小于 30元 会收到短信通知。`,
          `为了减少成本开销，每天通知的频率定在 1次/天，敬请谅解。`,
          `本项目由个人运营，费用自己买单，长期稳定免费供大家使用。`
      ]
    }
  },
  components: {
    ArgonButton,
  },
  watch: {
    inputDormitory: function () {
      let reg = /^T(\d{5,6})$/;
      this.inputClassDormitoryFlag = reg.test(this.inputDormitory);
    },
    inputCode: function () {
      let reg = /^\d{6}$/;
      this.inputClassCodeFlag = reg.test(this.inputCode);
    },
    inputTel: function () {
      let reg = /^[1][3,4,5,7,8][0-9]{9}$/;
      this.inputClassTelFlag = reg.test(this.inputTel);
    }
  },
  methods: {
    showValidate: function () {
     if (!this.inputClassDormitoryFlag || !this.inputClassTelFlag) return
     this.captchaIns.refresh()
     this.captchaIns && this.captchaIns.verify()
    },
    smsDoMission: function (){
      if (!this.inputClassDormitoryFlag || !this.inputClassCodeFlag || !this.inputTel) return
      const data = {
        dormitory: this.inputDormitory,
        code: parseInt(this.inputCode),
        tel: this.inputTel,
      }
      insertOrUpdate(data).then(res => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: res.data.Tips,
          showConfirmButton: false,
          timer: 2000
        })
        this.timeout2 = setTimeout( () => {
          location. reload()
        }, 2500)
      }).catch(err => {
        Swal.fire({
          title: '错误原因',
          text: `${err.errmsg.substring(0, 10) + (10 < err.errmsg.length ? "..." : "")}`,
          icon: 'error',
          confirmButtonText: '关闭'
        })
      })
    }
  },
  created() {
    body.classList.remove("bg-gray-100");
  },
  mounted() {
    let e = this;
    // eslint-disable-next-line no-undef
    initNECaptcha({ // 使用的是CDN下的，这里不进行eslint检测
      captchaId: '005a85fde0624883b90bbe226dd0d730',
      element: '#captcha',
      mode: 'popup',
      apiVersion: 2,
      width: '320px',
      onVerify: function (err, data) {
        if (err) return
        e.isSend.inWait = true
        e.remain = 60
        e.isSend.msg = `${e.remain}s`
        const params = {
          validate: data.validate,
          tel: e.inputTel
        }
        getCode(params).then(res => {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: res.data.Tips,
            showConfirmButton: false,
            timer: 1500
          })
        }).catch(err => {
          Swal.fire({
            title: '网络不对劲',
            text: `错误原因：${err.errmsg.substring(0, 8) + (8 < err.errmsg.length ? "..." : "")}`,
            icon: 'error',
            confirmButtonText: '关闭'
          })
        })
        let interval = setInterval(function (e) {
          e.remain = e.remain - 1
          e.isSend.msg = `${e.remain}s`
        }, 1000, e)
        e.timeout = setTimeout(() => {
          clearInterval(interval)
          e.isSend.inWait = false
          e.isSend.msg = "获取"
        }, 1000 * 60);
      }
    }, function onload(instance) {
      e.captchaIns = instance;
    }, function onerror() {
      console.log("Y1dun err load")
    })
  },
  beforeUnmount() {
    clearInterval(this.timeout)
    clearInterval(this.timeout2)
  }
};
</script>
