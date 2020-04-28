import Vue from 'vue'
import Router from 'vue-router'
import { store } from '../store/index'

Vue.use( Router );

const route = [
    {
        path: '*',
        name: '404',
        component: () => import('../views/404')
    },
    {
        path: '/',
        name: 'Main',
        component: () => import('../views/index'),
        meta: {
            require: false
        },
    }
];

const routes = new Router({
    routes: route
});


// 路由跳转前处理
routes.beforeEach((to, from, next) => {

    store.commit('clearToken') // 取消请求

    if( to.meta.require ) { // 判断该路由是否需要登录权限
        if( store.state.token ){
            next();
        }else{
            location.href = 'localhost:8081';
        }
    } else {
        next();
    }
});

export default routes;
