<template>
  <div class="goods" @click="itemClick">
    <img v-lazy="showImage" alt @load="ImgLoad" />
    <div class="goods-info">
      <p>{{ goodsItem.title }}</p>
      <span class="price">￥{{ goodsItem.price }}</span>
      <span class="collect">{{ goodsItem.cfav }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "GoodsListItem",
  props: {
    goodsItem: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  components: {},
  data() {
    return {};
  },
  computed: {
    showImage() {
      return (
        this.goodsItem.image || this.goodsItem.show.img || this.goodsItem.img
      );
    }
  },
  methods: {
    ImgLoad() {
      // console.log("ImgLoad");
      // if($this.$route.path.indexOf('./home'))
      this.$bus.$emit("itemImageLoad"); //事件总线 发送事件
    },
    itemClick() {
      console.log("跳转到详情");
      this.$router.push("/detail/" + this.goodsItem.iid);
    }
  }
};
</script>
<style scoped>
.goods {
  padding-bottom: 40px;
  position: relative;
  width: 49%;
}
.goods img {
  width: 100%;
  border-radius: 5px;
}

.goods-info {
  font-size: 12px;
  /* position: absolute; */
  bottom: 5px;
  left: 0;
  right: 0;
  overflow: hidden;
  text-align: center;
}

.goods-info p {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 2px;
}

.goods-info .price {
  color: var(--color-high-text);
  margin-right: 20px;
}

.goods-info .collect {
  position: relative;
}

.goods-info .collect::before {
  content: "";
  position: absolute;
  left: -15px;
  top: 0;
  width: 14px;
  height: 14px;
  background: url("~assets/img/common/collect.svg") 0 0/14px 14px;
}
</style>
