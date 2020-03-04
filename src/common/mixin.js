import {
    debounce
} from "./utils";

export const itemListlistenerMixin = {
    data() {
        return {
            itemImageListener: null
        }
    },
    mounted() {
        const refresh = debounce(this.$refs.scroll.refresh, 100);
        this.itemImageListener = () => {
            refresh();
        }
        this.$bus.$on("itemImageLoad", this.itemImageListener);
        console.log('我是混入中的内容');
    },
}

import BackTop from "components/content/backtop/BackTop";
export const backTopMixin = {
    components: {
        BackTop
    },
    data() {
        return {
            isShowBackTop: false,
        }
    },
    methods: {
        backClick() {
            this.$refs.scroll.scrollTo(0, 0, 500);
        },
        listenShopBackTop(position) {
            this.isShowBackTop = -position.y > 1000;
        }
    },
}