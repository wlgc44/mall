<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav" />
    <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll">
      <detail-swiper :top-images="topImages" />
      <detail-base-info :goods="goods"></detail-base-info>
      <detail-shop-info :shop="shop"></detail-shop-info>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"></detail-goods-info>
      <detail-param-info ref="params" :param-info="paramInfo"></detail-param-info>
      <detail-comment-info ref="comment" :comment-info="commentInfo"></detail-comment-info>
      <goods-list ref="recommend" :goods="recommend"></goods-list>
    </scroll>
    <detail-bottom-bar @addToCart="addToCart"></detail-bottom-bar>
    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
  </div>
</template>

<script>
import DetailNavBar from "./childComps/DetaiNavBar";
import DetailSwiper from "./childComps/DetaiSwiper";
import DetailBaseInfo from "./childComps/DetailBaseInfo";
import DetailShopInfo from "./childComps/DetailShopInfo";
import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
import DetailParamInfo from "./childComps/DetailParamInfo";
import DetailCommentInfo from "./childComps/DetailCommentInfo";
import DetailBottomBar from "./childComps/DetailBottomBar";

import Scroll from "components/common/scroll/Scroll";
import GoodsList from "components/content/goods/GoodsList";

import { debounce } from "../../common/utils";
import { itemListlistenerMixin, backTopMixin } from "../../common/mixin";

import {
  getDetail,
  Goods,
  Shop,
  GoodsParam,
  getRecommend
} from "network/detail";

import { mapActions } from "vuex";

export default {
  name: "Detail",
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    Scroll,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    GoodsList,
    DetailBottomBar
  },
  mixins: [itemListlistenerMixin, backTopMixin],
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommend: [],
      themeTopY: [],
      getThemeTopY: null,
      currentIndex: 0
    };
  },
  created() {
    //1.保存传入的iid
    this.iid = this.$route.params.iid;
    // console.log(this.iid);
    //2.根据传入的iid请求数据
    getDetail(this.iid).then(res => {
      // console.log(res);
      // 1.获取轮播图片数据
      this.topImages = res.result.itemInfo.topImages;

      // 2.获取商品信息
      const data = res.result;
      this.goods = new Goods(
        data.itemInfo,
        data.columns,
        data.shopInfo.services
      );

      // 3.创建店铺信息的对象
      this.shop = new Shop(data.shopInfo);

      // 4.获取商品详情信息
      this.detailInfo = data.detailInfo;

      // 5.获取参数信息
      this.paramInfo = new GoodsParam(
        data.itemParams.info,
        data.itemParams.rule
      );

      // 6.取出商品评论信息
      if (data.rate.cRate !== 0) {
        this.commentInfo = data.rate.list[0];
      }

      // this.$nextTick(() => {
      //   //数据渲染后的下一帧执行
      //   //根据最新的数据，对应的dom已经被渲染完了，但图片还没有渲染出来
      //   this.themeTopY = [];
      //   this.themeTopY.push(0);
      //   this.themeTopY.push(this.$refs.params.$el.offsetTop);
      //   this.themeTopY.push(this.$refs.comment.$el.offsetTop);
      //   this.themeTopY.push(this.$refs.recommend.$el.offsetTop);
      //   console.log(this.themeTopY);
      // });
    });

    // 3.请求推荐数据
    getRecommend().then(res => {
      this.recommend = res.data.list;
    });

    // 4.给getThemeTopY赋值 防抖
    this.getThemeTopY = debounce(() => {
      this.themeTopY = [];
      this.themeTopY.push(0);
      this.themeTopY.push(-this.$refs.params.$el.offsetTop + 44);
      this.themeTopY.push(-this.$refs.comment.$el.offsetTop + 44);
      this.themeTopY.push(-this.$refs.recommend.$el.offsetTop + 44);
      //加一个最大值 Number.MAX_VALUE
      // console.log(this.themeTopY);
    }, 100);
  },
  mounted() {},
  destroyed() {
    //取消全局事件监听
    this.$bus.$off("itemImageLoad", this.itemImageListener);
  },
  watch: {},
  computed: {},
  methods: {
    ...mapActions(["addCar"]),
    imageLoad() {
      this.$refs.scroll.refresh();
      this.getThemeTopY();
    },
    titleClick(index) {
      // console.log(index);
      this.$refs.scroll.scrollTo(0, this.themeTopY[index], 100);
    },
    contentScroll(position) {
      // console.log(position);
      //获取y值
      const positionY = -position.y;
      //与主题中的值对比
      const length = this.themeTopY.length;
      for (let i = 0; i < length; i++) {
        if (
          this.currentIndex != i && //如果数组里面加了最大值，此处可以少掉最后一层遍历，去除边界判断
          ((i < length - 1 &&
            positionY >= -this.themeTopY[i] &&
            positionY < -this.themeTopY[i + 1]) ||
            (i === length - 1 && positionY >= -this.themeTopY[i]))
        ) {
          this.currentIndex = i;
          // console.log(this.currentIndex);
          this.$refs.nav.currentIndex = this.currentIndex;
        }
      }
      this.listenShopBackTop(position); //混入的backtop
    },
    addToCart() {
      console.log("car");
      // 1.获取购物车需要展示的信息
      const product = {};
      product.image = this.topImages[0];
      product.title = this.goods.title;
      product.desc = this.goods.desc;
      product.price = this.goods.realPrice;
      product.iid = this.iid;

      // 2.将商品添加到购物车里
      // this.$store.dispatch("addCar", product).then(res => {
      //   console.log(res);
      // });

      //映射actions
      this.addCar(product).then(res => {
        // console.log(res);
        this.$toast.show(res);
      });
    }
  }
};
</script>
<style scoped>
#detail {
  position: relative;
  z-index: 12;
  background-color: #fff;
  height: 100vh;
}
.content {
  height: calc(100% - 44px - 58px);
}
.detail-nav {
  position: relative;
  z-index: 12;
  background-color: #fff;
}
</style>
