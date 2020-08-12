import {debounce} from './utils';
import BackTop from 'components/content/backTop/BackTop';

export const itemListenerMixin = {
  data() {
    return {
      itemImgListener: null,
      newRefresh: null
    }
  },
  mounted() {
    this.newRefresh = debounce(this.$refs.scroll.refresh,50);

    this.itemImgListener = () => {
      this.newRefresh();
    }

    this.$bus.$on('itemImgload',this.itemImgListener);
  }
}

export const backTopmixin = {
  data() {
    return {
      isShowBackTop: false
    }
  },
  components: {
    BackTop
  },
  methods: {
    backTopClick() {
      this.$refs.scroll.scrollTo(0,0,300);
    },
    listenShowBackTop(position) {
      // 判断backTop是否显示
      this.isShowBackTop = position.y < -650;
    }
  }
}