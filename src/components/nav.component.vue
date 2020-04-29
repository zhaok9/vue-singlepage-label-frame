<template>
    <div class="component-nav">
        <div class="scroll-nav" :class="{ hide: !navigation }">
            <navtree :navs="navs" :openid="openid" :level="level" :currentKeepAlive="currentKeepAlive" :go="go"></navtree>
        </div>
        <!-- 展开收起 -->
        <div class="control" @click.stop="toggleNav">
            <i class="iconfont icon-xiaoyuhao" :class="{ hide: !navigation }"></i>
        </div>
    </div>
</template>
<script>
    import { mapMutations, mapState } from "vuex";
    import IScroll from 'iscroll/build/iscroll-probe';

    Vue.component('navtree', {
        props:["navs", "openid", "level", "currentKeepAlive", "go"],
        template: `
            <ul :data-level="level">
                <li v-for="item of navs" @click.stop="go( item )" :class="{ active: currentKeepAlive.id == item.id }">
                    <div class="title">
                        <template v-if="level == 1">
                            <i class="iconfont" :class="item.icon"></i>
                            <span>{{ item.title }}</span>
                            <i class="iconfont icon-xiaoyuhao"></i>
                        </template>
                        <template v-else>
                            <i class="point"></i><span>{{ item.title }}</span>
                        </template>
                    </div>
                    <template v-if="item.children">
                        <navtree :class="{ show: openid == item.id }" :navs="item.children" :level="parseInt(level) + 1" :currentKeepAlive="currentKeepAlive" :go="go"></navtree>
                    </template>
                </li>
            </ul>
        `,
    });

    export default {
        name: 'ComponentNav',
        data() {
            return {
                navs: [],
                openid: -1,
                nScroll: null,
            }
        },
        props: ["source", "level"],
        watch: {
            source(n){
                this.navs = n;
            },
            currentKeepAlive(n){
                n.pid ? null : this.openid = n.id;
                this.refreshscroll();
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
            this.$emit('getvalue', this.currentKeepAlive || this.navs[0]);
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
                    this.$emit('refreshscroll');
                }
            }
        },
        beforeDestroy(){

        }
    }
</script>
<style lang="scss">
    .component-nav {
        height: 100%;
        position: relative;

        .scroll-nav {
            height: 100%;
            overflow: hidden;
            opacity: 1;
            transition: all .2s ease-out;
            width: 200px;


            &.hide {
                opacity: 0;
                width: 0;
            }
        }

        ul[data-level="1"]{
            cursor: pointer;
            position: relative;
            z-index: 2;

            >li {
                transition: all .2s linear;

                >.title {
                    align-items: center;
                    display: flex;
                    flex-wrap: nowrap;
                    height: 42px;
                    margin: 0 20px;
                    transition: all .2s linear;
                    white-space: nowrap;

                    i:nth-child(1){
                        height: 19px;
                        line-height: 1;
                        margin-left: 15px;
                        text-align: center;
                        width: 18px;
                    }

                    i:nth-child(3){
                        font-size: 12px;
                        margin-right: 15px;
                        opacity: .6;
                    }

                    span {
                        flex: 1;
                        margin-left: 15px;
                    }
                }

                ul {
                    .title {
                        align-items: center;
                        cursor: pointer;
                        display: flex;
                        height: 42px;
                        line-height: 42px;
                        white-space: nowrap;

                        span {
                            flex: 1;
                            margin-left: 15px;
                            transition: all .2s linear;
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
                    margin-left: 45px;
                    overflow: hidden;
                    width: calc(100% - 47px);

                    &.show {
                        height: 100%;
                    }

                    ul {
                        margin-left: 26px
                    }
                }
            }
        }

        .control {
            border-radius: 64px;
            cursor: pointer;
            height: 64px;
            line-height: 64px;
            margin-top: -32px;
            padding: 0 8px 0 0;
            position: absolute;
            right: -20px;
            top: 50%;
            text-align: right;
            width: 64px;
            z-index: 1;

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
    }
</style>
