import Vue from 'vue';
import Vuex from 'vuex';
import STATIC_SOURCE from './static.source';

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        STATIC_SOURCE, // 共用静态数据源

        // 是否显示导航
        navigation: true,

        // 清理请求
        cancelTokenArr: [],

        // 重载页面请求公用状态完成时
        complete: false,

        // 缓存组件页
        currentKeepAlive: JSON.parse(localStorage.getItem('currentKeepAlive')) || null,

        keepAliveRouter: JSON.parse(localStorage.getItem('keepAliveRouter')) || [],

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

            let loops = d => {
                d.forEach( f => {
                    if( f.children && f.children.length > 0 ){
                        loops( f.children );
                    }
                    f.active = f.component == value.component && f.id == value.id;
                });
            }
            loops( state.keepAliveRouter );

            value.active = true;
            state.currentKeepAlive = value;

            localStorage.setItem('keepAliveRouter', JSON.stringify(state.keepAliveRouter) );

            localStorage.setItem('currentKeepAlive', JSON.stringify(state.currentKeepAlive) )
        },

        editKeepAliveRouter( state, value ){
            if( value.params ){
                state.keepAliveRouter = JSON.parse(localStorage.getItem('keepAliveRouter')) || [];
                state.keepAliveRouter = state.keepAliveRouter.map( s => {
                    if( s.component == value.component ) {
                        s.params = value.params;
                    }
                    return s;
                });

                state.currentKeepAlive.params = value.params;

                localStorage.setItem('keepAliveRouter', JSON.stringify(state.keepAliveRouter) );
                localStorage.setItem('currentKeepAlive', JSON.stringify(state.currentKeepAlive) );
            }
        },

        removeKeepAliveRouter( state, value ){
            state.keepAliveRouter = state.keepAliveRouter.filter( f => f.component != value.component );
            localStorage.setItem('keepAliveRouter', JSON.stringify(state.keepAliveRouter) );
        },

        // 添加共用数据源
        addSource( state, value ){
            // value = { key, [] }
            if( value.key ){
                state.STATIC_SOURCE[ value.key ] = value.val;
            }
        },

        // 页面(组件)是否加载完成
        completed( state, value ){
            state.complete = value;
        },
        setEnableLoad( state, value ){
            state.enableload = value;
        },
        saveToken( state, value ){
            state.token = value;
            localStorage.setItem('token', value);
        },
        saveUserInfo( state, value ){
            state.userinfo = value;
            localStorage.setItem('userinfo', JSON.stringify(value));
        },
        toggleNavigation( state, value ){
            state.navigation = value;
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