<!-- CartList -->
<template>
  <div class="cart-list">
    <scroll class="content" ref="scroll">
      <cart-list-item v-for="(item,index) in list" 
                      :item-info="item" 
                      :key="index"/>
    </scroll>
  </div>
</template>

<script>
import Scroll from 'components/common/scroll/Scroll';
import CartListItem from './CartListItem';

import {mapGetters} from 'vuex';

export default {
  name: 'CartList',
  components: {
    Scroll,
    CartListItem
  },
  computed: {
    ...mapGetters({
      list: 'cartList'
    })
  },
  activated() {
    this.$refs.scroll.refresh()
  }
}

</script>

<style scoped>
  .cart-list {
    height: 100vh;
  }

  .content {
    height: calc(100% - 44px - 51px - 44px);
    overflow: hidden;
  }
</style>