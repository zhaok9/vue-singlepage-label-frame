<template>
    <div class="component-nav">
        <!-- 大菜单 -->
        <div class="scroll-nav" :class="{ hide: !navigation }">
            <Navtree :navs="navs" :openid="openid" :level="level" :currentKeepAlive="currentKeepAlive || this.navs[0]" :go="go"></Navtree>
        </div>

        <!-- 小菜单 -->
        <div class="small-scroll-nav">
            <ul>
                <li
                    v-for="item of navs"
                    :class="{ active: currentKeepAlive ? currentKeepAlive.id == item.id : false }"
                    :data-child="item.children && item.children.length > 0"
                    @click.stop="go( item )"
                    @mouseenter="smallOver( $event, item)">
                    <template v-if="item.children && item.children.length > 0">
                        <i :class="['iconfont', item.icon]"></i>
                    </template>
                    <template v-else>
                        <el-tooltip :content="$t(item.title)" placement="right">
                            <i :class="['iconfont', item.icon]"></i>
                        </el-tooltip>
                    </template>
                </li>
            </ul>
            <div class="small-scroll-nav-children" :class="{ active: smallopen }">
                <Smallnav :navs="smallcurr" :currentKeepAlive="currentKeepAlive" :go="go" :smallOut="smallOut"></Smallnav>
            </div>
        </div>

        <!-- 展开收起 -->
        <template v-if="showControl">
            <div class="control" @click.stop="toggleNav">
                <i class="iconfont icon-xiaoyuhao" :class="{ hide: !navigation }"></i>
            </div>
        </template>
    </div>
</template>
<script>
    import Vue from "vue";
    import { mapMutations, mapState } from "vuex";
    import { store } from '../store';
    import IScroll from 'iscroll/build/iscroll-probe';

    Vue.component('Navtree', {
        props:["navs", "openid", "level", "currentKeepAlive", "go"],
        template: `
            <ul :data-level="level">
                <li v-for="item of navs" @click.stop="go( item )" :class="{ active: currentKeepAlive.id == item.id || currentKeepAlive.keepid == item.id }">
                    <div class="title" :class="{ open: openid == item.id, list: !item.url }">
                        <template v-if="level == 1">
                            <i class="iconfont" :class="item.icon"></i>

                            <template v-if="$util.strlen( $t(item.title) ) > 8">
                                <el-tooltip :content="$t(item.title)" placement="right"><span>{{ $t(item.title) }}</span></el-tooltip>
                            </template>
                            <template v-else>
                                <span>{{ $t(item.title) }}</span>
                            </template>

                            <i class="iconfont icon-xiaoyuhao" :class="{ rotate: currentKeepAlive.id == item.id || openid == item.id  }"></i>
                        </template>
                        <template v-else>
                            <!-- <i class="point"></i> -->
                            <template v-if="$util.strlen( $t(item.title) ) > 16">
                                <el-tooltip :content="$t(item.title)" placement="right"><span>{{ $t(item.title) }}</span></el-tooltip>
                            </template>
                            <template v-else>
                                <span>{{ $t(item.title) }}</span>
                            </template>
                        </template>
                    </div>
                    <template v-if="item.children">
                        <Navtree :class="{ show: openid == item.id }" :navs="item.children" :level="parseInt(level) + 1" :currentKeepAlive="currentKeepAlive" :go="go"></Navtree>
                    </template>
                </li>
            </ul>
        `,
    });

    Vue.component('Smallnav',{
        props:["navs", "currentKeepAlive", "go", "smallOut"],
        template: `
            <ul v-if="navs" @mouseleave="smallOut">
                <li v-for="item of navs.children" @click.stop="go(item)" :class="{ active: currentKeepAlive.id == item.id || currentKeepAlive.keepid == item.id }">
                    <div class="text">
                        <!-- <i class="point"></i> -->
                        <template v-if="$util.strlen( $t(item.title) ) > 16">
                            <el-tooltip :content="$t(item.title)" placement="right"><span>{{ $t( item.title) }}</span></el-tooltip>
                        </template>
                        <template v-else>
                            <span>{{ $t(item.title) }}</span>
                        </template>
                    </div>
                    <template v-if="item.children && item.children.length > 0">
                        <Smallnav :navs="item" :currentKeepAlive="currentKeepAlive" :go="go" :smallOut="smallOut"></Smallnav>
                    </template>
                </li>
            </ul>
        `
    });

    export default {
        name: 'ComponentNav',
        data() {
            return {
                navs: [],
                openid: localStorage.getItem('navopenid' ) || -1,
                nScroll: null,
                showControl: false,
                smallEl: null,
                smallLay: null,
                smallopen: false,
                smallcurr: null,
            }
        },
        props: ["source", "level"],
        watch: {
            source(n){
                this.navs = n;
            },
            currentKeepAlive(n){
                n.pid ? (
                    n.level == 2 ? (
                        this.openid = n.pid,
                        localStorage.setItem('navopenid', n.pid)
                    ) : (()=>{
                        let loops = d => {
                            d.some( s => {
                                if( s.level == 2 && s.id == n.pid ){
                                    this.openid = s.pid;
                                    localStorage.setItem('navopenid', s.pid)
                                    return true;
                                }

                                if( s.children && s.children.length > 0 ){
                                    loops( s.children );
                                }
                            });
                        }
                        loops( this.navs );
                    })()
                ) : (
                    localStorage.removeItem('navopenid'),
                    this.openid = -1
                );

                this.refreshscroll();

                store.commit('clearToken') // 取消请求

                let time = setTimeout(() => {
                    this.smallopen = false;
                    clearTimeout(time);
                }, 1000);
            },
            navigation(){
                this.smallopen = false;
            }
        },
        computed: {
            ...mapState(["currentKeepAlive", "navigation"]),
        },
        created(){

        },
        mounted(){
            this.navs = this.source;
            this.nScroll = new IScroll('.scroll-nav', {
                scrollbars: true,
                mouseWheel: true,
                fadeScrollbars: true
            });
            this.$emit('getvalue', this.currentKeepAlive || this.navs.filter( f => f.active )[0]);
            this.openid > -1 ? this.refreshscroll() : null;
        },
        methods: {

            ...mapMutations(["toggleNavigation"]),

            /**
             * [refreshscroll 更新菜单滚动条]
             * @return {[type]} [description]
             */
            refreshscroll(){
                setTimeout(()=> this.nScroll.refresh(), 0)
            },

            toggleNav(){
                this.toggleNavigation( !this.navigation );
            },

            go( item ){
                this.refreshscroll();

                if( item.url && !item.pid ){ // 顶级菜单点击
                    this.$emit('getvalue', item);
                }else{
                    // 展开收起子级菜单、点击子级菜单
                    item.pid ? this.$emit('getvalue', item) : (this.openid = this.openid == item.id ? -1 : item.id);
                    localStorage.setItem('navopenid', this.openid );
                    this.$emit('refreshscroll');
                }
            },

            /**
             * [smallOver 图标菜单移入]
             * @param  {[type]} e    [description]
             * @param  {[type]} item [description]
             * @return {[type]}      [description]
             */
            smallOver(e, item){
                this.smallEl = e.target.nodeName == 'LI' ? e.target : e.target.nodeName == 'I' ? e.target.parentNode : null;
                this.smallopen = this.smallEl && this.smallEl.dataset.child;
                this.smallcurr = item;
            },

            /**
             * [smallOut 图标菜单移除]
             * @return {[type]} [description]
             */
            smallOut(){
                this.smallopen = false;
            }
        },
        beforeDestroy(){

        }
    }
</script>
<style lang="scss">
    .component-nav {
        height: calc(100% - 82px);
        position: relative;

        .scroll-nav {
            height: 100%;
            overflow: hidden;
            opacity: 1;
            // transition: all .2s ease-out;
            width: 210px;

            &.hide {
                opacity: 0;
                width: 64px;
            }
        }

        ul[data-level="1"]{
            cursor: pointer;
            position: relative;
            z-index: 2;

            >li {
                font-size: 14px;
                transition: all .2s linear;

                &:nth-child(1) {
                    margin-top: -1px;
                }

                >.title {
                    align-items: center;
                    display: flex;
                    flex-wrap: nowrap;
                    height: 42px;
                    margin: 0 20px 0 20px;
                    transition: background .2s linear, color .2s linear, border .2s linear;
                    white-space: nowrap;

                    i:nth-child(1){
                        font-size: 18px;
                        height: 21px;
                        line-height: 1;
                        margin-left: 15px;
                        text-align: center;
                        width: 18px;
                    }

                    i:nth-child(3){
                        font-size: 12px;
                        margin-right: 15px;
                        opacity: .6;
                        transition: all .2s linear;
                        transform: rotate(0deg);

                        &.rotate {
                            transform: rotate(90deg);
                        }
                    }

                    span {
                        flex: 1;
                        margin: 0 15px;
                        max-width: 50%;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }

                    &.open {
                        height: 43px;
                        line-height: 41px;
                        position: relative;
                    }

                    &.list {
                        transition: none;
                    }
                }

                ul {
                    li {
                        font-size: 12px;
                        transition: all .2s linear;
                    }
                    .title {
                        align-items: center;
                        cursor: pointer;
                        display: flex;
                        height: 42px;
                        line-height: 42px;
                        padding-left: 42px;
                        transition: background .2s linear, color .2s linear, border .2s linear;
                        white-space: nowrap;

                        span {
                            flex: 1;
                            margin: 0 10px 0 28px;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            transition: all .2s linear;
                            white-space: nowrap;
                        }

                        .point {
                            border-radius: 100%;
                            height: 4px;
                            transition: all .2s linear;
                            width: 4px;
                        }
                    }
                }

                ul[data-level="2"] {
                    height: 0;
                    overflow: hidden;

                    &.show {
                        height: 100%;
                    }

                    ul {
                        .title {
                            padding-left: 70px
                        }
                    }
                }
            }
        }

        .control {
            border-radius: 64px;
            cursor: pointer;
            height: 64px;
            line-height: 64px;
            margin-top: -73px;
            padding: 0 8px 0 0;
            position: absolute;
            right: -20px;
            top: 50%;
            text-align: right;
            width: 64px;
            z-index: -1;

            i {
                display: inline-block;
                font-size: 12px;
                opacity: .6;
                transform: rotate(180deg);
                transition: all .2s linear;

                &.hide {
                    transform: rotate(360deg);
                }
            }
        }

        .small-scroll-nav {
            height: calc(100% + 64px);
            opacity: 0;
            position: absolute;
            top: -18px;
            // transition: all .2s ease-out;
            transform: translateX(-210px);
            width: 64px;

            ul {
                min-height: 100%;
                li {
                    cursor: pointer;
                    height: 42px;
                    line-height: 42px;
                    text-align: center;
                    transition: all .2s linear;

                    i { font-size: 18px; }
                }
            }
        }

        .small-scroll-nav-children {
            height: calc(100% + 18px);
            left: 65px;
            position: absolute;
            top: -64px;
            transform: translateX(-180px);
            // transition: all .1s ease-in-out;
            width: 172px;
            z-index: -1;

            &.active {
                transform: translateX(0px);
            }

            .text {
                align-items: center;
                display: flex;
                margin: 0 10px;
                // padding: 0 10px;
                text-align: left;

                span {
                    flex: 1;
                    margin: 0 10px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .rotate { font-size: 12px; }

                &+ul {
                    li {
                        .text {
                            padding-left: 26px;
                        }
                    }
                }
            }

            .point {
                border-radius: 100%;
                height: 4px;
                transition: all .2s linear;
                width: 4px;
            }

        }
    }
</style>
