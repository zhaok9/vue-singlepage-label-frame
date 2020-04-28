<template>
    <div class="views">
        <header class="header">
            <HeaderComponent></HeaderComponent>
        </header>

        <nav class="nav">
            <NavComponent :source="navdata" @getvalue="toggle"></NavComponent>
        </nav>

        <div class="content">
            <LablesComponent :source="keepAliveRouter" @getvalue="toggle"></LablesComponent>
            <div class="main">
                <!-- 模块入口 -->
                <keep-alive :include="keepAliveRouter.map( f => f.component).join()">
                    <component v-bind:is="currentKeepAlive ? currentKeepAlive.component : ''"></component>
                </keep-alive>
            </div>
        </div>
    </div>
</template>
<script>
import { mapMutations, mapState } from "vuex";
import IScroll from 'iscroll/build/iscroll-probe';

let that = null;

const loader = () => {
    if( that ){
        Vue.component(`${ that.currentKeepAlive.component }`, resolve => {
            setTimeout(() => {
                require([`.${ that.currentKeepAlive.url }`], resolve)
                .catch( res => {
                    if( that ){
                        that.$router.push({ path: '/404' });
                    }
                });
                setTimeout(() => that.completed(true), 60);
            }, 0);
        });
    }
}

export default {
    name: "Views",
    data() {
        return {
            online: "",
            mScroll: null,
            nScroll: null,
            navdata: [
                {
                    url: '/home',
                    title: '首页',
                    component: 'Page-home',
                    active: true,
                    children: []
                },
                { url: '/template', title: '组件实例', component: 'Page-template', active: false }
            ]
        }
    },
    computed: {
        ...mapState(["complete", "token", "userinfo", "keepAliveRouter", "currentKeepAlive"]),
    },
    watch: {
        $route(to, from) {
        },
        complete( bool ){
            if( bool ){
                this.mScroll = new IScroll('.main', {
                    scrollbars: true,
                    mouseWheel: true,
                    fadeScrollbars: true
                });
            }else{
                if( this.mScroll ){
                    this.mScroll.destroy();
                    this.mScroll = null;
                }
            }
        },
        currentKeepAlive(n){
            // this.toggle(n, false);
            loader();
        },
        keepAliveRouter(n){
            if( !n.some( s => s.component == this.currentKeepAlive.component ) ){
                this.toggle( n[ n.length - 1] );
            }
        }
    },
    created() {
        that = this;
    },
    mounted() {
        this.nScroll = new IScroll('.nav', {
            scrollbars: true,
            mouseWheel: true,
            fadeScrollbars: true
        });
    },
    methods: {
        ...mapMutations(["empty", "completed", "addKeepAliveRouter"]),

        toggle( item ){
            this.completed(false);
            this.navdata.forEach( f => f.active = f.component == item.component );
            this.addKeepAliveRouter( item );
            loader();
        }
    }
};
</script>
<style scoped lang="scss">

</style>