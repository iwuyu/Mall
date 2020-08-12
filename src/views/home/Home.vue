<!-- Home -->
<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <tab-control :titles="['流行','新款','精选']" 
                   @tabClick="tabClick" 
                   ref="tabControl1"
                   class="tab-control"
                   v-show="isTabFixed"/>
    <scroll class="content" 
            ref="scroll" 
            :probe-type="3" 
            @scroll="contentScroll" 
            :pull-up-load="true"
            @pullingUp="loadMore">
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"/>
      <recommend-view :recommends="recommends"/>
      <feature-view/>
      <tab-control :titles="['流行','新款','精选']" 
                   @tabClick="tabClick" 
                   ref="tabControl2"/>
      <goods-list :goods="showGoods"></goods-list>
    </scroll>
    <back-top @click.native="backTopClick" v-show="isShowBackTop"/>
  </div>
</template>

<script>
import NavBar from 'components/common/navbar/NavBar';
import Scroll from 'components/common/scroll/Scroll';
import TabControl from 'components/content/tabcontrol/TabControl';
import GoodsList from 'components/content/goods/GoodsList';

import HomeSwiper from './childComps/HomeSwiper';
import RecommendView from './childComps/RecommendView';
import FeatureView from './childComps/FeatureView';

import {getHomeMultidata,getHomeGoods} from "network/home";

import {debounce} from "common/utils";
import {itemListenerMixin,backTopmixin} from 'common/mixin';

export default {
  name: 'Home',
  components: {
    NavBar,
    Scroll,
    TabControl,
    GoodsList,

    HomeSwiper,
    RecommendView,
    FeatureView,
  },
  data() {
    return {
      banners: [],
      recommends: [],
      goods: {
        'pop' : {page: 0,list: []},
        'new': {page: 0,list: []},
        'sell': {page: 0,list: []},
      },
      currentType: 'pop',
      tabOffsetTop: 0,
      isTabFixed: false,
      saveY: 0
    }
  },
  mixins:[itemListenerMixin,backTopmixin],
  computed:{
    showGoods() {
      return this.goods[this.currentType].list;
    }
  },
  activated() {
    
    this.$refs.scroll.refresh();
    this.$refs.scroll.scrollTo(0,this.saveY,0);
  },
  deactivated() {
    // 保存Y值
    this.saveY = this.$refs.scroll.getScrollY();

    // 取消全局事件的监听
    this.$bus.$off('goodItemImageLoad',this.itemImgListener);
  },
  created() {
    // 请求多个数据
    this.getHomeMultidata();

    // 请求商品数据
    this.getHomeGoods('pop');
    this.getHomeGoods('new');
    this.getHomeGoods('sell');
  },
  mounted() {
    // 监听图片加载完成
    // 这个地方img标签确实被挂载，但是其中的图片还没有占据高度
    // this.$refs.scroll.refresh对着各函数进行防抖操作
    // let refresh = debounce(this.$refs.scroll.refresh,50);

    // // 对监听的事件进行保存
    // this.itemImgListener = () => {
    //   refresh();
    // }
    // this.$bus.$on('goodItemImageLoad',this.itemImgListener);
  },
  methods: {
    /**
     * 事件监听相关方法
     */
    tabClick(index) {
      switch (index) {
        case 0: this.currentType = 'pop'; break;
        case 1: this.currentType = 'new'; break;
        case 2: this.currentType = 'sell';break;
      }
      this.$refs.tabControl1.currentIndex = index;
      this.$refs.tabControl2.currentIndex = index;
    },
    contentScroll(position) {
      // 判断backTop是否显示
        this.listenShowBackTop(position);

      // 决定tabControl是否吸顶
      this.isTabFixed = (-position.y) > this.tabOffsetTop
    },
    loadMore() {
      this.getHomeGoods(this.currentType)
    },
    swiperImageLoad() {
      // 获取tabControl的offsetTop
      // 所有组件都有一个属性$el: 用于获取组件中的元素
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
    },

    /**
     * 网络请求相关方法
     */
    getHomeMultidata(){
      getHomeMultidata().then(res => {
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
      })
    },
    getHomeGoods(type){
      const page = this.goods[type].page + 1;
      getHomeGoods(type,page).then(res => {
        this.goods[type].list.push(...res.data.list);
        this.goods[type].page += 1;

        // 完成上拉加载更多 使得可以多次上拉加载（默认只能上拉加载一次）
        this.$refs.scroll.finishPullUp();
      })
    },
    
    /**
     * 点击注册按钮事件
     * */
    register:function () {
      if(this.userName.length <= 0) {
          alert("用户名不能为空")
      }else if(this.userPassword.length <= 0) {
          alert("密码不能为空")
      }else {
        axios.post('/user/addUser', { 
          userName: this.userName,
          userPassword: this.userPassword,
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}   //跨域
        }).then((dat)=> {
          if (dat.data == '1'&&dat.data.code === 200) {
            alert("注册成功")
          }else {
            alert("注册失败")
          }
        })
      }
    }
    

  }
}
</script>

<style scoped>
  #home {
    /* padding-top: 44px; */
    padding-bottom: 49px;
    height: 100vh;
    position: relative;
  }
  .home-nav {
    background-color: var(--color-tint);
    color: #fff;

    /* position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 9;  */
  }

  .content {
    overflow: hidden;
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }

  .tab-control {
    position: relative;
    z-index: 9;
  }
</style>