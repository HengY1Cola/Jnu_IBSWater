<template>
  <nav
    class="navbar navbar-expand-lg top-0 z-index-3 position-absolute mt-4 blur border-radius-lg my-3 py-2 start-0 end-0 mx-4 shadow"
  >
    <div class="container px-2 py-2">
      <router-link
        class="navbar-brand font-weight-bolder ms-lg-0 ms-3 text-black"
        to="/"
        >HengY1Service</router-link
      >
      <button
        class="shadow-none navbar-toggler ms-2"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navigation"
      >
        <span class="mt-2 navbar-toggler-icon">
          <span class="navbar-toggler-bar bar1"></span>
          <span class="navbar-toggler-bar bar2"></span>
          <span class="navbar-toggler-bar bar3"></span>
        </span>
      </button>
      <div class="collapse navbar-collapse" id="navigation">
        <ul class="nav navbar-nav mx-auto">
          <li class="nav-item">
            <router-link
              class="nav-link d-flex align-items-center me-3 active"
              aria-current="page"
              to="/home"
            >
              <i
                class="fa fa-home opacity-6 me-1 text-dark"
                aria-hidden="true"
              ></i>
              首页
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
                class="nav-link d-flex align-items-center me-3 active"
                to="/search"
            >
              <i
                  class="fa fa-chart-pie opacity-6 me-1 text-dark"
                  aria-hidden="true"
              ></i>
              查询
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
                class="nav-link d-flex align-items-center me-3 active"
                to="/sms"
            >
              <i
                  class="fa fa-commenting opacity-6 me-1 text-dark"
                  aria-hidden="true"
              ></i>
              短信
            </router-link>
          </li>
        </ul>
        <ul class="navbar-nav d-lg-block d-none">
          <li class="nav-item">
            <a
              href="https://trk2yzbpzr.feishu.cn/docx/doxcnpVCZcMARLBw914fmYGpLAg"
              class="btn btn-sm mb-0 me-1"
              :class="isBtn"
              >开放文档</a
            >
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import downArrWhite from "@/assets/img/down-arrow-white.svg";
import downArrBlack from "@/assets/img/down-arrow-dark.svg";

export default {
  name: "navbar",
  data() {
    return {
      downArrWhite,
      downArrBlack,
      darkMode: "text-dark",
    };
  },
  props: {
    btnBackground: String,
    isBtn: { type: String, default: "bg-gradient-light" },
  },
};
</script>
