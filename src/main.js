import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import FastClick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'

import toast from 'components/common/toast'

Vue.config.productionTip = false

Vue.prototype.$bus = new Vue() //通过原型将$bus（事件总线）赋值成一个vue实例

//安装toast插件
Vue.use(toast)

//解决移动端300ms延迟
FastClick.attach(document.body);

//使用懒加载插件
Vue.use(VueLazyLoad, {
    loading: require('./assets/img/common/placeholder.png') //占位图
});

new Vue({
    render: h => h(App),
    router,
    store
}).$mount('#app')