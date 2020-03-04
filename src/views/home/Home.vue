<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <tab-control
      id="tab-control"
      :titles="['流行','新款','精选']"
      @tabClick="tabClick"
      ref="tabControl1"
      v-show="isTabFixed"
    ></tab-control>
    <scroll
      class="content"
      ref="scroll"
      :probe-type="3"
      @scroll="contentScroll"
      :pullUpLoad="true"
      @pullingUp="loadMore"
    >
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"></home-swiper>
      <recommend-view :recommends="recommends"></recommend-view>
      <feature-view></feature-view>
      <tab-control :titles="['流行','新款','精选']" @tabClick="tabClick" ref="tabControl"></tab-control>
      <goods-list :goods="showGoods"></goods-list>
    </scroll>
    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
  </div>
</template>

<script>
import HomeSwiper from "./childComps/HomeSwiper";
import RecommendView from "./childComps/RecommendView";
import FeatureView from "./childComps/FeatureView";

import NavBar from "components/common/navbar/NavBar";
import TabControl from "components/content/tabControl/TabControl";
import GoodsList from "components/content/goods/GoodsList";
import Scroll from "components/common/scroll/Scroll";

import { getHomeMUltidata, getHomeGoods } from "network/home";
import { debounce } from "../../common/utils";
import { itemListlistenerMixin, backTopMixin } from "../../common/mixin";

export default {
  name: "Home",
  components: {
    NavBar,
    HomeSwiper,
    RecommendView,
    FeatureView,
    TabControl,
    GoodsList,
    Scroll
  },
  mixins: [itemListlistenerMixin, backTopMixin],
  data() {
    return {
      banners: [],
      recommends: [],
      goods: {
        pop: { page: 0, list: [] },
        new: { page: 0, list: [] },
        sell: { page: 0, list: [] }
      },
      currentType: "pop",

      tabOffsetTop: 0,
      isTabFixed: false,
      saveY: 0
    };
  },
  computed: {
    showGoods() {
      return this.goods[this.currentType].list;
    }
  },
  created() {
    //1.请求多个数据
    this.getHomeMUltidata();
    //2.请求商品数据
    this.getHomeGoods("pop");
    this.getHomeGoods("new");
    this.getHomeGoods("sell");
  },
  mounted() {
    //3.监听item图片加载完成
    // const refresh = debounce(this.$refs.scroll.refresh, 100);
    // //对监听事件进行保存
    // this.itemImageListener = refresh;
    // this.$bus.$on("itemImageLoad", () => {
    //   // console.log(this.$bus);
    //   // this.$refs.scroll.refresh();
    //   refresh();
    // });
  },
  destroyed() {
    console.log("destroyed");
  },
  activated() {
    // console.log("activated"); //进来页面
    // console.log(this.saveY);
    this.$refs.scroll.scrollTo(0, this.saveY, 0);
    this.$refs.scroll.refresh();

    //取消全局事件监听
    this.$bus.$off("itemImageLoad", this.itemImageListener);
  },
  deactivated() {
    // console.log("deactivated"); //离开页面
    this.saveY = this.$refs.scroll.getCurrentY(); //记录离开时的位置
  },
  methods: {
    /**
     * 事件监听事件
     */
    // debounce(func, delay) {
    //   //防抖函数 避免图片加载后调用刷新多次
    //   let timer = null;

    //   return function(...args) {
    //     if (timer) clearTimeout(timer);

    //     timer = setTimeout(() => {
    //       func.apply(this, args);
    //     }, delay);
    //   };
    // },
    tabClick(index) {
      // console.log(index);
      switch (index) {
        case 0:
          this.currentType = "pop";
          break;
        case 1:
          this.currentType = "new";
          break;
        case 2:
          this.currentType = "sell";
          break;
      }
      this.$refs.tabControl.currentIndex = index;
      this.$refs.tabControl1.currentIndex = index;
    },

    contentScroll(position) {
      // console.log(position);
      //判断backtop是否显示
      // this.isShowBackTop = -position.y > 1000;
      this.listenShopBackTop(position);
      //决定tabcontrol是否吸顶
      this.isTabFixed = -position.y > this.tabOffsetTop;
    },
    loadMore() {
      // console.log("上拉加载更多");
      this.getHomeGoods(this.currentType);
      const refresh = debounce(this.$refs.scroll.refresh, 100);
      this.itemImageListener = () => {
        refresh();
      };
      this.$bus.$on("itemImageLoad", this.itemImageListener);
    },
    swiperImageLoad() {
      //等轮播图加载完成
      //获取tabcontrol的offsettop
      //所有组件都有一个属性$el，可以拿到组件下面的元素
      console.log(this.$refs.tabControl.$el.offsetTop);
      this.tabOffsetTop = this.$refs.tabControl.$el.offsetTop;
    },
    /**
     * 网络请求相关方法
     */
    getHomeMUltidata() {
      getHomeMUltidata().then(res => {
        // console.log(res);
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
      });
    },
    getHomeGoods(type) {
      const page = this.goods[type].page + 1;
      getHomeGoods(type, page).then(res => {
        // console.log(res);
        this.goods[type].list.push(...res.data.list); //把获取的所有数据添加到数组
        this.goods[type].page += 1;

        this.$refs.scroll.finishPullUp();
      });
    }
  }
};
</script>
<style scoped>
#home {
  padding-top: 44px;
  height: 100vh;
  position: relative;
}
.home-nav {
  background-color: #ff8198;
  color: white;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 9;
}
/* .tab-control {
  position: sticky;
  top: 44px;
  z-index: 9;
  background-color: #fff;
} */
#tab-control {
  position: relative;
  z-index: 9;
  background-color: #fff;
}
.content {
  /* height: calc(100% - 93px); */
  overflow: hidden;
  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
}
/* .fixed {
  position: fixed;
  top: 44px;
  z-index: 9;
  left: 0;
  right: 0;
  background-color: #fff;
} */
</style>