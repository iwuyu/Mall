<!-- Toast -->
<template>
  <div class="toast"  v-show="issShow">
    <div>{{messages}}</div>
  </div>
</template>

<script>
export default {
  name: 'Toast',
  props:{
    issShow: {
      type: Boolean,
      default: false
    },
    messages: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      message: '',
      isShow: false
    }
  },
  methods: {
    show(message='默认文字',duration=2000) {
      this.isShow = true;
      this.message = message;

      setTimeout(() => {
        this.isShow = false;
        this.message = '';
      },duration)
    }
  }
  
}

</script>

<style scoped>
  .toast {
    position: fixed;
    z-index: 999;

    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);

    padding: 8px 10px;
    border-radius: 25px;

    color: #fff;
    background-color: rgba(0,0,0,.6);
    
  }
</style>