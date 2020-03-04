<template>
  <div class="toast" v-show="iSshow">
    <div>{{message}}</div>
  </div>
</template>

<script>
export default {
  name: "Toast",
  data() {
    return {
      message: "",
      iSshow: false
    };
  },
  methods: {
    show(message = "默认文字", duration = 2000) {
      this.iSshow = true;
      this.message = message;

      setTimeout(() => {
        this.iSshow = false;
        this.message = "";
      }, duration);
    }
  }
};
</script>
<style scoped>
.toast {
  position: fixed;
  background-color: rgba(0, 0, 0, 0.75);
  color: #fff;
  padding: 8px 10px;
  transform: translate(-50%, -50%);
  z-index: 999;
  left: 50%;
  top: 50%;
}
</style>