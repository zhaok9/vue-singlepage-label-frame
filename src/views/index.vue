<template>
    <div class="views">
        <header class="header">
            <HeaderComponent></HeaderComponent>
        </header>

        <nav class="nav">
            <NavComponent level="1" :source="navdata" @getvalue="toggle" @refreshscroll="refreshscroll"></NavComponent>
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
                { id:1, url: '/home', title: '首页', component: 'Page-home', active: true },
                { id:2, url: '/template', title: '组件实例', component: 'Page-template', active: false },
                {
                    id:4,
                    url: '',
                    title: '测试菜单',
                    component: '',
                    active: false ,
                    children: [
                        { id:41, pid:4, url: '/template', title: '二级菜单', component: 'Page-template', active: false, }
                    ]
                },
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

        /**
         * [refreshscroll 更新菜单滚动条]
         * @return {[type]} [description]
         */
        refreshscroll(){
            setTimeout(()=> this.nScroll.refresh(), 0)
        },

        /**
         * [toggle 切换标签]
         * @param  {[type]} item [description]
         * @return {[type]}      [description]
         */
        toggle( item ){
            this.completed(false);

            let loops = d => {
                d.forEach( f => {
                    if( f.children && f.children.length > 0 ){
                        loops( f.children );
                    }
                    f.active = f.component == item.component && f.id == item.id;
                });
            }
            loops( this.navdata );

            this.addKeepAliveRouter( item );
            loader();
        }
    }
};
</script>
<style scoped lang="scss">

</style>