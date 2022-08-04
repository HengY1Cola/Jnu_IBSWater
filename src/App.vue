<template>
  <div class="container top-0 position-sticky z-index-sticky">
    <div class="row">
      <div class="col-12">
        <navbar
            isBtn="bg-gradient-success"
        />
      </div>
    </div>
  </div>
  <main
    class="main-content position-relative max-height-vh-100 h-100 border-radius-lg"
  >
    <router-view />
  </main>
</template>
<script>
import Navbar from "@/components/Navbar.vue";
import setTooltip from "@/assets/js/tooltip";

export default {
  name: "App",
  components: {
    Navbar,
  },
  mounted() {
    setTooltip();
  },
};
</script>
