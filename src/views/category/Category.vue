<!-- Category -->
<template>
<div class="wrapper">
  <h2>分类</h2>
  <back-top @click.native="backTopClick" v-show="isShowBackTop"/>
</div>
  
  
</template>

<script>
// import BScroll from 'better-scroll';
import {backTopmixin} from 'common/mixin';

export default {
  name: 'Category',
  data() {
    return {
      scroll: null
    }
  },
  mixins:[backTopmixin],
  // mounted() {
  //   this.scroll = new BScroll(document.querySelector('.wrapper'),{
  //     probeType: 3,
  //     pullUpLoad: true
  //   })
  //   this.scroll.on('scroll',(position) => {
  //     // console.log(position);
  //   })
  //   this.scroll.on('pullingUp',() => {
  //     // 上拉加载更多
  //     console.log('上拉加载更多');
  //   })
  // }
}
</script>

<style scoped>
  
</style>