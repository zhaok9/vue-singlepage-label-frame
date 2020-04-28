import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        // 清理请求
        cancelTokenArr: [],

        // 重载页面请求公用状态完成时
        complete: false,

        // 缓存组件页
        currentKeepAlive: JSON.parse(localStorage.getItem('currentKeepAlive')) || null,
        keepAliveRouter: JSON.parse(localStorage.getItem('keepAliveRouter')) || [],

        router: localStorage.getItem('router') || '',

        // socket地址
        socket: '',

        // token
        token: localStorage.getItem('token') || '',

        // userinfo
        userinfo: localStorage.getItem('userinfo') || '',

        // 是否启用进度条
        enableload: false,

        // 本地登录时常
        beforetime: localStorage.getItem('beforetime') || '',

    },
    mutations: {
        // 跳转路由清理请求 ==================================================
        pushToken (state, payload) {
            state.cancelTokenArr.push( payload.cancelToken );
        },
        clearToken ({ cancelTokenArr }) {
            cancelTokenArr.forEach(item => item('cancelRequest'));
            cancelTokenArr = [];
        },
        // 跳转路由清理请求 ==================================================

        addKeepAliveRouter( state, value ){
            state.keepAliveRouter = JSON.parse(localStorage.getItem('keepAliveRouter')) || [];

            state.keepAliveRouter.push( value );

            state.keepAliveRouter = state.keepAliveRouter.reduce( ( all, next ) => all.some( item => item['component'] == next['component'] ) ? all : [...all, next ] ,[]);

            state.keepAliveRouter.forEach( f => f.active = f.component == value.component );

            value.active = true;
            state.currentKeepAlive = value;

            localStorage.setItem('keepAliveRouter', JSON.stringify(state.keepAliveRouter) );

            localStorage.setItem('currentKeepAlive', JSON.stringify(state.currentKeepAlive) )
        },

        removeKeepAliveRouter( state, value ){
            state.keepAliveRouter = state.keepAliveRouter.filter( f => f.component != value.component );
            localStorage.setItem('keepAliveRouter', JSON.stringify(state.keepAliveRouter) );
        },

        // 页面(组件)是否加载完成
        completed( state, value ){
            state.complete = value;
        },
        setEnableLoad( state, value ){
            state.enableload = value;
        },
        setRouter( state, value ){
            state.router = value;
            localStorage.setItem('router', JSON.stringify(value));
        },
        saveToken( state, value ){
            state.token = value;
            localStorage.setItem('token', value);
        },
        saveUserInfo( state, value ){
            state.userinfo = value;
            localStorage.setItem('userinfo', JSON.stringify(value));
        },
        empty( state ){
            state.token = '';
            state.userinfo = '';
            localStorage.removeItem('token');
            localStorage.removeItem('userinfo');
            localStorage.removeItem('beforetime');
        }
    },
    getters: {
    },
    actions: {
    }
});