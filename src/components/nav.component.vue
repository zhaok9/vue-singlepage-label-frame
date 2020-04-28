<template>
    <div class="component-nav">
        <navtree :navs="navs" :level="level" :currentKeepAlive="currentKeepAlive" :go="go"></navtree>
    </div>
</template>
<script>
    import { mapMutations, mapState } from "vuex";

    Vue.component('navtree', {
        props:["navs", "level", "currentKeepAlive", "go"],
        template: `
            <ul :data-level="level">
                <li v-for="item of navs" @click.stop="go( item )">
                    <div class="title" :class="{ active: currentKeepAlive.id == item.id }">
                        <template v-if="level == 1">
                            <i>图标</i>
                            <span>{{ item.title }}</span>
                            <i>图标</i>
                        </template>
                        <template v-else>
                            <span>{{ item.title }}</span>
                        </template>
                    </div>
                    <template v-if="item.children">
                        <navtree :navs="item.children" :level="parseInt(level) + 1" :currentKeepAlive="currentKeepAlive" :go="go"></navtree>
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
            }
        },
        props: ["source", "in", "level"],
        watch: {
            source(n){
                this.navs = n;
            },
            currentKeepAlive(n){
                this.openid = n.id;
            }
        },
        computed: {
            ...mapState(["currentKeepAlive"]),
        },
        created(){

        },
        mounted(){
            this.navs = this.source;
            !this.in ? this.$emit('getvalue', this.currentKeepAlive || this.navs[0]) : null;
        },
        methods: {
            go( item ){
                if( item.url ){
                    this.$emit('getvalue', item);
                }else{
                    // 展开收起子菜单
                    this.openid = this.openid == item.id ? -1 : item.id;
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
        ul[data-level="1"]{
            > li {
                > .title {
                    align-items: center;
                    cursor: pointer;
                    display: flex;
                    flex-wrap: wrap;
                    height: 42px;
                    transition: all .2s linear;

                    i:nth-child(1){ margin-left: 33px; }
                    i:nth-child(3){ margin-right: 24px; }
                    span {
                        flex: 1;
                        margin-left: 15px;
                    }
                }


                .component-nav {
                    height: 0;
                    overflow: hidden;
                    width: 100%;

                    &.show {
                        height: 100%;
                    }
                }
            }
        }
    }
</style>
