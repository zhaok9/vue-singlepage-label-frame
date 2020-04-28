<template>
    <div class="component-nav">
        <ul :data-level="level">
            <li v-for="item of navs" @click.preventDefault="go( item )">
                <div class="title" :class="{ active: currentKeepAlive.id == item.id && openId == -1 }">
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
                    <component-nav :level="parseInt(level) + 1" :in="true" :source="item.children" @getvalue="go" :class="{ show: openId == item.id }"></component-nav>
                </template>
            </li>
        </ul>
    </div>
</template>
<script>
    import { mapMutations, mapState } from "vuex";
    export default {
        name: 'ComponentNav',
        data() {
            return {
                navs: [],
                openId: -1
            }
        },
        props: ["source", "in", "level"],
        watch: {
            source(n){
                this.navs = n;
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
                    this.openId = -1;
                    this.$emit('getvalue', item);
                }else{
                    // 展开收起子菜单
                    this.openId = this.openId > 0 ? -1 : item.id;
                    this.$emit('refreshscroll');
                }
            }
        },
        beforeDestroy(){

        }
    }
</script>
<style scoped lang="scss">
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
