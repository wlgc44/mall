import {
    ADD_COUNTER,
    ADD_CART
} from './mutation-types';
export default {
    //有异步操作或逻辑判断较多，通过action
    addCar(context, payload) {
        // payload新添加的商品
        // let oldProduct = null;
        // for (let item of state.cartList) {
        //     if (item.iid === payload.iid) {
        //         oldProduct = item;
        //     }
        // }

        return new Promise((resolve, reject) => {
            // 1.查找之前数组中是否有该商品
            let oldProduct = context.state.cartList.find(function(item) {
                return item.iid === payload.iid; //当相等则返回
            });

            // 2.判断oldProduct
            if (oldProduct) {
                // oldProduct.count += 1;
                context.commit(ADD_COUNTER, oldProduct);
                resolve('当前商品数量加一');
            } else {
                payload.count = 1;
                // state.cartList.push(payload);
                context.commit(ADD_CART, payload);
                resolve('添加了新的商品');
            }
        })
    }
}