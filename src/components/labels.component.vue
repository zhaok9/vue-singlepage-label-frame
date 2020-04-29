<template>
    <div class="component-labels">
        <template v-for="( item, index ) of labels">
            <div :class="{ active: item.active }" @click.stop="toggle( item )">
                <span>{{ $t(item.title) }}</span>
                <i v-if="index > 0" @click.stop="destroy( item )">&times;</i>
            </div>
        </template>
        <div class="more" :hidden="!morelabels.length > 0" @click.stop="toggleMore">
            <i class="iconfont icon-xiaoyuhao"></i>
            <ul :class="{ show: ismore }">
                <li v-for="(item, index) of morelabels" @click.stop="toggle( item )" :class="{ active: item.active }">
                    <span>{{ $t(item.title) }}</span>
                    <i @click.stop="destroy( item )">&times;</i>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
    import { mapMutations, mapState } from "vuex";

    export default {
        name: 'ComponentLables',
        data() {
            return {
                labels: [],
                morelabels: [],
                ismore: false
            }
        },
        props: ['source'],
        watch: {
            source(n){
                this.labels = n.slice(0, 10);
                this.morelabels = n.slice(10, n.length);
            }
        },
        computed: {
        },
        created(){},
        mounted(){
            this.labels = this.source.slice(0, 10);
            this.morelabels = this.source.slice(10, this.source.length);
        },
        methods: {
            ...mapMutations(["removeKeepAliveRouter"]),
            toggle( item ){
                this.$emit('getvalue', item);
            },
            destroy( item ){
                this.removeKeepAliveRouter( item );
            },
            toggleMore(){
                this.ismore = !this.ismore;
            }
        },
        beforeDestroy(){

        }
    }
</script>
<style scoped lang="scss">
    .component-labels {
        display: flex;
        height: 32px;
        position: relative;
        user-select: none;
        width: 100%;

        div:not(:last-child) {
            align-items: center;
            cursor: pointer;
            display: flex;
            line-height: 32px;
            margin-left: -1px;
            padding: 0 10px;
            text-align: center;
            transition:  all .2s linear;
            width: calc(10% - 1.4px);

            span {
                overflow: hidden;
                text-overflow: ellipsis;
                text-indent: 15px;
                width: 100%;
                white-space: nowrap;
            }

            i {
                border-radius: 100%;
                font-size: 18px;
                height: 12px;
                line-height: 10px;
                margin-left: 5px;
                opacity: .5;
                transition:  all .2s linear;
                width: 12px;

                &:hover {
                    opacity: 1;
                }
            }

            &:nth-child(1) {
                span { text-indent: 0; }
            }
        }

        .more {
            cursor: pointer;
            height: 32px;
            line-height: 32px;
            position: absolute;
            right: 0;
            text-align: center;
            width: 25px;

            i {
                color: #99999A;
                display: inline-block;
                font-size: 14px;
                transform: rotate(90deg);
            }

            ul {
                border-radius: 0 0 3px 3px;
                display: none;
                min-width: 200px;
                position: absolute;
                right: 0px;
                top: 31px;
                white-space: nowrap;
                z-index: 1;

                li {
                    align-items: center;
                    display: flex;
                    line-height: 42px;
                    padding: 0 20px;
                    text-align: left;

                    &:hover {
                        transition: all .2s linear;
                    }

                    span {
                        flex: 1;
                    }

                    i {
                        border-radius: 100%;
                        font-size: 18px;
                        height: 12px;
                        line-height: 10px;
                        margin-left: 5px;
                        opacity: .5;
                        transition:  all .2s linear;
                        width: 12px;

                        &:hover {
                            opacity: 1;
                        }
                    }
                }

                &.show {
                    display: block;
                }
            }
        }
    }
</style>
