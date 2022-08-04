<template>
  <main class="mt-0 main-content">
    <section>
      <div class="page-header min-vh-100">
        <div class="container">
          <div class="row row-cols-1 row-cols-sm-2">
            <div class="mx-auto col d-flex flex-column mx-lg-0 min-vh-50">
              <div class="card card-plain top-50 w-75" style="transform: translate(10%, -50%)">
                <div class="pb-0 card-header text-start mt-3">
                  <h4 class="font-weight-bolder d-none d-sm-block">查询余额/消费记录</h4>
                  <p class="mb-0">输入宿舍号并选择后进行查询</p>
                </div>
                <div class="card-body">
                  <form role="form">
                    <div class="row">
                      <div class="col-12">
                        <div class="form-group">
                        <input type="text" v-model="inputValue" class="form-control form-control-lg" :class="inputClassFlag ? 'is-valid' : 'is-invalid' " name="dormitory" placeholder="例如：T110222"/>
                        </div>
                      </div>
                    </div>
                    <div class="col-12">
                      <argon-checkbox id="check_balance" :checked="check[0]" @click="handleCheck(0)">查询余额</argon-checkbox>
                      <argon-checkbox id="check_record" :checked="check[1]" @click="handleCheck(1)">查询消费记录</argon-checkbox>
                    </div>
                    <div class="col-12">
                      <argon-button
                        class="mt-2" variant="gradient" color="success" fullWidth size="lg" @click.prevent="doSearch"
                      >进行查询</argon-button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div class="col">
              <div class="position-relative m-0 border-radius-lg d-flex flex-column justify-content-start"
                style="background-image: linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%);"
              >
                <search-loading v-if="showIndex === 1"></search-loading>
                <search-default v-if="showIndex === 2" :defaultValue="defaultRes" :defaultUrl="urlAim"></search-default>
                <search-balance v-if="showIndex === 3" :balanceValue="balance" :balanceUrl="urlAim"></search-balance>
                <search-record v-if="showIndex === 4" :recordValue="record" :recordUrl="urlAim"></search-record>
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
import ArgonCheckbox from "@/argon_components/ArgonCheckbox.vue";
import SearchDefault from "@/components/SearchDefault.vue";
import SearchLoading from "@/components/SearchLoading.vue";
import SearchBalance from "@/components/SearchBalance.vue";
import SearchRecord from "@/components/SearchRecord.vue";
import Swal from 'sweetalert2'
import { totalCount, getBalance, getRecord} from "@/request/api"
import axios from "axios";
const body = document.getElementsByTagName("body")[0];

export default {
  name: "search",
  components: {
    ArgonButton,
    ArgonCheckbox,
    SearchDefault,
    SearchLoading,
    SearchBalance,
    SearchRecord
  },
  data() {
    return {
      check: [true, false],
      inputClassFlag: false,
      inputValue: "",
      showIndex: 1, // 默认进去是加载阶段
      defaultRes: [], // 流量统计传值
      urlAim: "", // 传递到子组件的url
      balance: "", // 到余额中的数据
      record: "" // 到记录中的数据
    }
  },
  created() {
    body.classList.remove("bg-gray-100");
  },
  watch: {
    inputValue: function () {
      let reg = /^T(\d{5,6})$/;
      this.inputClassFlag = reg.test(this.inputValue);
    }
  },
  computed: {
    checkWhich: function () {
        return this.check.indexOf(true)
    }
  },
  methods: {
    handleCheck: function (index){
      if (this.check.indexOf(true) === index) {
        this.check[index] = false
        this.check[index ? 0 : 1] = true
        return
      }
      this.check[index] = true
      this.check[index ? 0 : 1] = false
    },
    doSearch: function (){
      if (!this.inputClassFlag) return
      let dormitory = this.inputValue.toUpperCase()
      this.showIndex = 1 // 进入加载页面
      switch (this.checkWhich) {
        case 0:
          getBalance(dormitory, ).then(res => {
            this.balance = res.data
            this.showIndex = 3
            this.urlAim = axios.defaults.baseURL + "/IBSJnuWeb/balance/" + dormitory
          }).catch(err => {
            Swal.fire({
              title: '网络错误',
              text: `错误原因：${err.errmsg.substring(0, 8) + (8 < err.errmsg.length ? "..." : "")}`,
              icon: 'error',
              confirmButtonText: '关闭'
            })
          })
          break
        case 1:
          getRecord(dormitory, ).then(res => {
            this.record = res.data
            this.showIndex = 4
            this.urlAim = axios.defaults.baseURL + "/IBSJnuWeb/status/" + dormitory
          }).catch(err => {
            Swal.fire({
              title: '网络错误',
              text: `错误原因：${err.errmsg.substring(0, 8) + (8 < err.errmsg.length ? "..." : "")}`,
              icon: 'error',
              confirmButtonText: '关闭'
            })
          })
          break
      }
    }
  },
  mounted() {
    totalCount().then(res => {
      this.defaultRes = res.data
      this.urlAim = axios.defaults.baseURL + "/IBSJnuWeb/total_count"
      this.showIndex = 2
    }).catch(err => {
      Swal.fire({
        title: '网络错误',
        text: `错误原因：${err.errmsg.substring(0, 8) + (8 < err.errmsg.length ? "..." : "")}`,
        icon: 'error',
        confirmButtonText: '关闭'
      })
    })
    Swal.fire({
      icon: 'info',
      title: '更多信息',
      text: '包含价格表、OpenApi等信息',
      footer: '<a href="https://trk2yzbpzr.feishu.cn/docx/doxcnpVCZcMARLBw914fmYGpLAg">👉 点击查看开放文档</a>'
    })
  }
};
</script>