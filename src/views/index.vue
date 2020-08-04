<template>
    <div class="views">
        <header class="header">
            <HeaderComponent></HeaderComponent>
        </header>
        <nav class="nav" :class="{ hide: !navigation }">
            <!-- 导航展开 -->
            <div class="user-head">
                <img :src="userinfo.icon" alt="" width="40" height="40">
                <span>{{ userinfo.userName }}</span>
            </div>
            <!-- 导航收起 -->
            <div class="small-user-head">
                <img src="/static/image/sinotrans/logo.png" alt="" width="40" height="40">
            </div>
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
import Vue from "vue";
import { mapMutations, mapState } from "vuex";
import IScroll from 'iscroll/build/iscroll-probe';

let that = null;

const loader = () => {
    if (that) {
        Vue.component(`${ that.currentKeepAlive.component }`, resolve => {
            if (that.sourcecomplate) {
                setTimeout(() => {
                    require([`.${ that.currentKeepAlive.url }`], resolve)
                        .catch(res => {
                            if (that) {
                                that.$router.push({ path: '/404' });
                            }
                        });
                    setTimeout(() => that.completed(true), 500);
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
                }
            ]
        }
    },
    computed: {
        ...mapState(["complete", "token", "userinfo", "keepAliveRouter", "currentKeepAlive", "navigation", "STATIC_SOURCE"]),
    },
    watch: {
        $route(to, from) {},
        complete(bool) {
        },
        currentKeepAlive(n) {
            if (n.params) {
                this.comparams = n.params;
                this.editKeepAliveRouter(n);
            }
            loader();
        },
        keepAliveRouter(n) {
            if (!n.some(s => s.component == this.currentKeepAlive.component)) {
                this.toggle(n[n.length - 1]);
            }
        },
        userinfo(n){
            this.user = n;
        }
    },
    beforeCreate() {

    },
    created() {
        that = this;
        this.currentKeepAlive ? loader() : null;

        this.getSource();
        localStorage.setItem('navdata', JSON.stringify(this.navdata));

        // this.api.getUserInfo( res => {
        //     res.code == 0 ? this.saveUserInfo( res.data.sysUser ) : console.log('获取用户信息失败.');
        // });

        // 获取导航数据
        // this.api.getNavigation({ isLeft: 1, type: 1 }, res => {

        //     // 处理菜单所需字段
        //     let navs = res.data,
        //         loops = (nav, level = 1, pid = -1 ) => {
        //             nav.forEach( f => (
        //                 pid > -1 ? f.pid = pid : null,
        //                 f.level = level,
        //                 f.children && f.children.length > 0 ? loops( f.children, 2, f.id ) : null
        //             ));
        //         };

        //     res.code == 0 ? (
        //         loops(navs),
        //         this.navdata = navs,
        //         this.getSource(),
        //         localStorage.setItem('navdata', JSON.stringify(this.navdata))
        //     ): null;
        // });
    },
    mounted() {

    },
    methods: {
        ...mapMutations(["empty", "saveUserInfo", "completed", "addKeepAliveRouter", "editKeepAliveRouter", "addSource"]),

        /**
         * [toggle 切换标签]
         * @param  {[type]} item [description]
         * @return {[type]}      [description]
         */
        toggle(item) {
            if (this.sourcecomplate) {

                this.completed(false);

                let first = this.navdata[0];

                let current = item || this.currentKeepAlive || (first && first.url ? first : first.children[0]);

                let loops = d => {
                    d.forEach(f => {
                        if (f.children && f.children.length > 0) {
                            loops(f.children);
                        }
                        f.active = f.component == current.component && f.id == current.id;
                    });
                }
                loops(this.navdata);

                this.addKeepAliveRouter(current);
                loader();
            }
        },

        /**
         * [getSource 获取数据源]
         * @return {[type]} [description]
         */
        getSource() {

            this.sourcecomplate = true;
            this.toggle();

            // this.http.sync([
            // ]).then(() => {
            //     this.sourcecomplate = true;
            //     this.toggle();
            // }).catch( e => {
            //     console.log('getSource Error:', e);
            // });
        }
    },
    beforeDestroy() {
        this.sourcecomplate = false;
    }
};

</script>
<style scoped lang="scss">
.views {
    .user-head {
        align-items: center;
        display: flex;
        height: 82px;
        overflow: hidden;
        padding: 0 0 0 20px;
        white-space: nowrap;

        img {
            border: 1px solid rgba(229, 229, 229, 0.96);
            border-radius: 100%;
            background: #E5E5E5;
            margin: 0 12px 0 0;
        }

        span {
            color: #082D6C;
        }
    }

    .small-user-head {
        align-items: center;
        border-bottom: 1px solid #e5e5e5;
        display: flex;
        height: 65px;
        justify-content: center;
        opacity: 0;
        position: absolute;
        top: 0;
        transform: translateX(-210px);
        width: 100%;
        z-index: 1;

        img {
            background: #E5E5E5;
            border-radius: 40px;
            height: 40px;
            width: 40px;
        }
    }
}

</style>
