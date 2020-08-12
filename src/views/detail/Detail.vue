<!-- Detail -->
<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick = "titleClick" ref="detailNav"/>
    <scroll class="content" ref="scroll" @scroll="contentScroll" :probe-type="3">
      <detail-swiper :top-images="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
      <detail-param-info ref="params" :param-info="paramInfo"/>
      <detail-comment-info ref="comments" :comment-info="commentInfo"/>
      <goods-list ref="recommends" :goods="recommends"/>
    </scroll>
    
    <back-top @click.native="backTopClick" v-show="isShowBackTop"/>
    <detail-bottom-bar @addToCart="addToCart" class="botton-bar"/>
    <toast :messages = "message" :issShow="isShow"/>
  </div>
  
</template>

<script>
import DetailNavBar from './childComps/DetailNavBar';
import DetailSwiper from './childComps/DetailSwiper';
import DetailBaseInfo from './childComps/DetailBaseInfo';
import DetailShopInfo from './childComps/DetailShopInfo';
import DetailGoodsInfo from './childComps/DetailGoodsInfo';
import DetailParamInfo from './childComps/DetailParamInfo';
import DetailCommentInfo from './childComps/DetailCommentInfo';
import DetailBottomBar from './childComps/DetailBottomBar';

import Scroll from 'components/common/scroll/Scroll';
import GoodsList from 'components/content/goods/GoodsList';

import {getDetail,Goods,Shop,GoodsParam,getRecommend} from 'network/detail';
import {debounce} from 'common/utils';
import {itemListenerMixin,backTopmixin} from 'common/mixin';

import {mapActions} from 'vuex';

import Toast from 'components/common/toast/Toast';

export default {
  name: 'Detail',
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      themeTopYs: [],
      getThemeTopY: null,
      currentIndex: null,
      message: '',
      isShow: false
    }
  },
  mixins:[itemListenerMixin,backTopmixin],
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    DetailBottomBar,
    Scroll,
    GoodsList,
    Toast
    // BackTop
  },

  created() {
    // 保存传入的iid
    this.iid = this.$route.params.iid

    // 根据iid请求详情数据
    getDetail(this.iid).then(res => {
      const data = res.result;
      // 获取顶部的图片轮播数据
      this.topImages = res.result.itemInfo.topImages;

      // 获取商品信息
      this.goods = new Goods(data.itemInfo,data.columns,data.shopInfo.services);

      // 获取店铺信息
      this.shop = new Shop(data.shopInfo);

      // 获取商品的详情数据
      this.detailInfo = data.detailInfo;

      // 获取参数信息
      this.paramInfo = new GoodsParam(data.itemParams.info,data.itemParams.rule);

      // 获取评论信息
      // 判断是否有评论
      if(data.rate.cRate !== 0){
        this.commentInfo = data.rate.list[0];
      }
    })

    // 请求推荐数据
    getRecommend().then(res => {
      this.recommends = res.data.list;
    })

    // 给getThemeTopY赋值
    this.getThemeTopY = debounce(() => {
      this.$nextTick(() => {
        this.themeTopYs = [];
        this.themeTopYs.push(0);
        this.themeTopYs.push(this.$refs.params.$el.offsetTop );
        this.themeTopYs.push(this.$refs.comments.$el.offsetTop );
        this.themeTopYs.push(this.$refs.recommends.$el.offsetTop);
        this.themeTopYs.push(Number.MAX_VALUE);
      },100)
    })
  },

  mounted() {
    
  },

  updated() {
    
  },

  destroyed() {
    this.$bus.$off('itemImgload',this.itemImgListener);
  },

  methods: {
    ...mapActions(['addCart']),
    imageLoad() {
      this.$refs.scroll.refresh();

      this.getThemeTopY();
    },
    titleClick(index) {
      this.$refs.scroll.scrollTo(0,-this.themeTopYs[index],500);
    },
    contentScroll(position) {
      // 获取y值
      const positionY = -position.y;

      // positionY和主题中进行对比

      let length = this.themeTopYs.length;
      for(let i = 0; i< length - 1; i++){
        if(this.currentIndex !== i && (positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i + 1])){
          this.currentIndex = i;
          this.$refs.detailNav.currentIndex = this.currentIndex;
        }

        // if(this.currentIndex !== i && ((i < length - 1 && positionY >= this.themeTopYs[i] && positionY < 
        // this.themeTopYs[i + 1]) || (i === length - 1 && positionY >= this. themeTopYs[i]))) {
        //   this.currentIndex = i;
        //   this.$refs.detailNav.currentIndex = this.currentIndex;
        // }
        
        // 判断backTop是否显示
        this.listenShowBackTop(position);
      
      }


    },
    addToCart() {
      // 获取购物车需要展示的信息
      const product = {};
      product.image = this.topImages[0];
      product.title = this.goods.title;
      product.desc = this.goods.desc;
      product.price = this.goods.realPrice;
      product.iid = this.iid;

      this.addCart(product).then(res => {
        this.isShow = true;
        this.message = res;

        setTimeout(() => {
          this.isShow = false;
          this.message = '';
        },1500)
      })
    }
  }
}

</script>

<style scoped>
  #detail {
    height: 100vh;
  }

  #detail,.detail-nav {
    position: relative;
    z-index: 11;
    background-color: #fff;
  }

  .content {
    height: calc(100% - 44px - 51px);
  }

  /* .botton-bar {
    position: relative;
    background-color: #fff;
  } */
</style>