<template>
  <main class="mt-0 main-content">
    <section>
      <div class="page-header min-vh-100">
        <div class="modal fade" id="myModal" tabindex="-1" aria-labelledby="myModalLabel" aria-hidden="true" data-bs-backdrop="static">
          <div class="modal-dialog modal-dialog-centered" style="width: 360px; margin: 0 auto">
            <div class="modal-content">
              <div class="modal-body">
                <go-captcha
                  :max-dot="captcha.maxDot"
                  :image-base64="captcha.imageBase64"
                  :thumb-base64="captcha.thumbBase64"
                  @close="handleCloseEvent"
                  @refresh="handleRefreshEvent"
                  @confirm="handleConfirmEvent"
                />
              </div>
            </div>
          </div>
        </div>
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
                            @click.prevent="handleShowEvent" :disabled="isSend.inWait"
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
import GoCaptcha from "@/components/GoCaptcha";
import bgImg from "@/assets/img/notice.png";
import { getCaptcha, getCode, insertOrUpdate } from "@/request/api";
import Swal from "sweetalert2";
import { Modal } from "bootstrap";

const body = document.getElementsByTagName("body")[0];

export default {
  name: "sms",
  data() {
    return {
      bgImg,
      isSend: {
        inWait: false,
        msg: "发送"
      },
      captcha: {
        init: true,
        maxDot: 5,
        key: '',
        imageBase64: '',
        thumbBase64: '',
      },
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
      ],
    }
  },
  components: {
    ArgonButton,
    GoCaptcha,
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
    },
    handleShowEvent: function() {
      if (!this.inputClassDormitoryFlag || !this.inputClassTelFlag) return
      if (!this.captcha.init || this.captcha.key === '') this.doRefresh() // 刷新下验证码
      this.captcha.init = false
      this.myModal.show()
    },
    handleCloseEvent: function() {
      this.myModal.hide()
    },
    handleRefreshEvent: function() {
      this.$emit('refresh')
      this.doRefresh()
    },
    handleConfirmEvent: function(data) {
      this.$emit('confirm', data)
      if (data.length <= 0) {
        this.doRefresh()
      }
      let dotArr = []
      data.forEach(function(elem){
        dotArr.push(elem.x - 10, elem.y + 30)
      })
      const params = {
        validate: dotArr,
        tel: this.inputTel,
        key: this.captcha.key
      }
      getCode(params).then(res => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: res.data.Tips,
          showConfirmButton: false,
          timer: 1500
        })
        this.myModal.hide()
        this.remain = 60
        this.isSend.inWait = true
        this.interval = setInterval(function (e) {
          e.remain = e.remain - 1
          e.isSend.msg = `${e.remain}s`
        }, 1000, this)
        this.timeout = setTimeout(() => {
          clearInterval(this.interval)
          this.isSend.inWait = false
          this.isSend.msg = "获取"
        }, 1000 * 60);
      }).catch(err => {
        Swal.fire({
          title: '错误原因',
          text: `${err.errmsg.substring(0, 8) + (8 < err.errmsg.length ? "..." : "")}`,
          icon: 'error',
          confirmButtonText: '关闭'
        })
        this.doRefresh()
      })
    },
    doRefresh: function() {
      getCaptcha().then(res => {
        this.captcha.key = res.data.key_index
        this.captcha.imageBase64 = res.data.image_base64
        this.captcha.thumbBase64 = res.data.thumb_base64
      }).catch(err => {
        console.log(err)
      })
    }
  },
  created() {
    body.classList.remove("bg-gray-100");
  },
  mounted() {
    this.myModal = new Modal(document.getElementById('myModal'))
    this.doRefresh()
  },
  beforeUnmount() {
    clearInterval(this.timeout)
    clearInterval(this.timeout2)
  }
};
</script>
