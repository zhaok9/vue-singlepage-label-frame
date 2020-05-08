<template>
    <div class="views">
        <header class="header">
            <HeaderComponent></HeaderComponent>
        </header>

        <nav class="nav" :class="{ hide: !navigation }">
            <NavComponent level="1" :source="navdata" @getvalue="toggle"></NavComponent>
        </nav>

        <div class="content">
            <LabelsComponent :source="keepAliveRouter" @getvalue="toggle"></LabelsComponent>
            <div class="main">
                <!-- 模块入口 -->
                <keep-alive :include="keepAliveRouter.map( f => f.component).join()">
                    <component v-bind:is="currentKeepAlive ? currentKeepAlive.component : ''" :params="comparams"></component>
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
            if( that.sourcecomplate){
                setTimeout(() => {
                    require([`.${ that.currentKeepAlive.url }`], resolve)
                    .catch( res => {
                        if( that ){
                            that.$router.push({ path: '/404' });
                        }
                    });
                    setTimeout(() => that.completed(true), 60);
                }, 0);
            }
        });
    }
}

export default {
    name: "Views",
    data() {
        return {
            online: "",
            mScroll: null,
            comparams: null,
            sourcecomplate: false,
            navdata: [
                {
                    id:1, url: '/template', title: 'comp.navigation.template', component: 'Page-template', active: true,
                    icon: 'icon-UPMSquanxianicon-',
                    level: 1
                },
                {
                    id:2, url: '/home', title: 'comp.navigation.home', component: 'Page-home', active: false,
                    icon: 'icon-daohangshouye',
                    level: 1
                },
                // {
                //     id:4,
                //     url: '',
                //     title: '测试菜单',
                //     component: '',
                //     active: false ,
                //     level: 1,
                //     children: [
                //         {
                //             id:41, pid:4, url: '/template', title: '二级菜单', component: 'Page-template', active: false,
                //             level: 2,
                //             children: [
                //                 {
                //                     id:411, pid:41, url: '/template', title: '三级菜单', component: 'Page-template', active: false,
                //                     level: 3
                //                 }
                //             ]
                //         }
                //     ]
                // },
            ]
        }
    },
    computed: {
        ...mapState(["complete", "token", "userinfo", "keepAliveRouter", "currentKeepAlive", "navigation", "STATIC_SOURCE"]),
    },
    watch: {
        $route(to, from) {
        },
        complete( bool ){
            // if( bool ){
            //     this.mScroll = new IScroll('.main', {
            //         scrollbars: true,
            //         mouseWheel: true,
            //         fadeScrollbars: true
            //     });
            // }else{
            //     if( this.mScroll ){
            //         this.mScroll.destroy();
            //         this.mScroll = null;
            //     }
            // }
        },
        currentKeepAlive(n){
            // this.toggle(n, false);
            if( n.params ){
                this.comparams = n.params;
                this.editKeepAliveRouter(n);
            }
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
        this.currentKeepAlive ? loader() : null;
        this.getSource();
    },
    mounted() {

    },
    methods: {
        ...mapMutations(["empty", "completed", "addKeepAliveRouter", "editKeepAliveRouter", "addSource"]),

        /**
         * [toggle 切换标签]
         * @param  {[type]} item [description]
         * @return {[type]}      [description]
         */
        toggle( item ){
            if( this.sourcecomplate ){

                this.completed(false);

                let current = item || this.currentKeepAlive || this.navdata[0];

                let loops = d => {
                    d.forEach( f => {
                        if( f.children && f.children.length > 0 ){
                            loops( f.children );
                        }
                        f.active = f.component == current.component && f.id == current.id;
                    });
                }
                loops( this.navdata );

                this.addKeepAliveRouter( current );
                loader();
            }
        },

        /**
         * [getSource 获取数据源]
         * @return {[type]} [description]
         */
        getSource(){
            this.http.sync([
                // new Promise((resolve, reject) => this.api.getDeviceSelectData( res => {
                //     if( res.code == 0 ){
                //         let data = res.data;

                //         for( let key in data ){
                //             this.addSource( { key, val: data[ key ] });
                //         }
                //     }
                //     resolve();
                // }))
            ]).then(() => {
                this.sourcecomplate = true;
                this.toggle();
                console.log( this.STATIC_SOURCE )
            });
        }
    },
    beforeDestroy(){}
};
</script>
<style scoped lang="scss">

</style>