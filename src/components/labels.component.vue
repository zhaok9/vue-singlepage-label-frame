<template>
    <div class="component-labels">
        <span class="prev" @click="jumpLabel('prev')">
            <i class="iconfont icon-fenye-shangyiye"></i>
        </span>
        <div class="labels">
            <div class="labels-scroll">
                <template v-for="( item, index ) of labels">
                    <div :class="{ active: item.active }" @click.stop="toggle( item )" :data-key="$t( item.title )" :data-index="index">
                        <template v-if="$util.strlen( (item.subtitle ? `${item.subtitle} - ` : '') + $t(item.title) ) > 8">
                            <el-tooltip :content="(item.subtitle ? `${item.subtitle} - ` : '') + $t(item.title)" placement="top"><span>{{ item.subtitle ? `${item.subtitle} - ` : '' }}{{ $t(item.title) }}</span></el-tooltip>
                        </template>
                        <template v-else>
                            <span>{{ item.subtitle ? `${item.subtitle} - ` : '' }}{{ $t(item.title) }}</span>
                        </template>

                        <i v-if="index > 0" @click.stop="destroy( item )">&times;</i>
                    </div>
                </template>
            </div>
        </div>
        <span class="next" @click="jumpLabel('next')">
            <i class="iconfont icon-fenye-xiayiye"></i>
        </span>

        <div class="more" :hidden="!morelabels.length > 0 || !showmore" @click.stop="toggleMore">
            <i class="iconfont icon-xiaoyuhao"></i>
            <ul :class="{ show: ismore }">
                <li v-for="(item, index) of morelabels" @click.stop="toggle( item )" :class="{ active: item.active }">
                    <template v-if="$util.strlen( $t(item.title) ) > 26">
                        <el-tooltip :content="$t(item.title)" placement="left"><span>{{ $t(item.title) }}</span></el-tooltip>
                        <i @click.stop="destroy( item )">&times;</i>
                    </template>
                    <template v-else>
                        <span>{{ $t(item.title) }}</span>
                        <i @click.stop="destroy( item )">&times;</i>
                    </template>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
    import { mapMutations, mapState } from "vuex";
    import IScroll from 'iscroll/build/iscroll-probe';

    export default {
        name: 'ComponentLables',
        data() {
            return {
                showmore: false,

                labels: [],
                morelabels: [],
                ismore: false,
                max: 10,
                iscroll: null,
            }
        },
        props: ['source'],
        watch: {
            source(n){
                this.labels = n.slice(0, this.max);
                this.morelabels = n.slice(this.max, n.length);
                setTimeout(()=>{
                    this.iscroll.refresh();
                },0);
            },
            currentKeepAlive( n ){
                setTimeout(()=>{
                    this.scrollTo( document.querySelector(`div[data-key="${ this.$t( n.title ) }"]`));
                },0);
            },
            navigation(){
                setTimeout(()=>{
                    this.iscroll.refresh();
                },300);
            }
        },
        computed: {
            ...mapState(['currentKeepAlive', 'navigation']),
        },
        created(){},
        mounted(){
            this.max = this.showmore ? 10 : 999;
            this.labels = this.source.slice(0, this.max);
            this.morelabels = this.source.slice(this.max, this.source.length);
            if( !this.showmore ){
                setTimeout(()=>{
                    this.iscroll = new IScroll('.component-labels .labels', {
                        scrollbars: true,
                        interactiveScrollbars: true,
                        // mouseWheel: true,
                        scrollY: false,
                        scrollX: true,
                        // fadeScrollbars: true
                    });
                    if(this.currentKeepAlive){
                        this.scrollTo( document.querySelector(`div[data-key="${ this.$t( this.currentKeepAlive.title ) }"]`) )
                    }
                },0)
            }
        },
        methods: {
            ...mapMutations([]),
            toggle( item ){
                this.$emit('getvalue', item);
            },
            destroy( item ){
                this.$util.labels.rm(item.component);
            },
            toggleMore(){
                this.ismore = !this.ismore;
            },
            scrollTo( el ){
                this.iscroll.scrollToElement( el );
            },
            jumpLabel( type ){
                let index = this.labels.findIndex( f => f.active );

                type == 'prev' ? index-- : index++;

                this.$emit('getvalue', this.labels[ index > this.labels.length - 1 ? index - 1 : ( index < 0 ? 0 : index )  ]);
            }
        },
        beforeDestroy(){

        }
    }
</script>
<style scoped lang="scss">
    .component-labels {
        display: flex;
        height: 44px;
        padding: 10px 10px 0 10px;
        position: relative;
        user-select: none;
        width: 100%;

        .labels {
            flex: 1;
            margin: 0 5px;
            overflow: hidden;
            // padding: 0 0 0 1px;
            position: relative;
            width: calc(100% - 68px);

            &-scroll {
                display: inline-flex;

                div {
                    align-items: center;
                    cursor: pointer;
                    display: flex;
                    flex-shrink: 0;
                    height: 29px;
                    line-height: 30px;
                    // margin-left: -1px;
                    padding: 0 10px;
                    text-align: center;
                    transition:  all .2s linear;
                    // width: calc(10% - 1.4px);
                    width: 120px;

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
            }
        }

        .prev, .next {
            border-radius: 3px;
            cursor: pointer;
            height: 24px;
            line-height: 24px;
            position: relative;
            top: 2.4px;
            text-align: center;
            width: 24px;

            i { font-size: 12px; }
        }

        .more {
            border-radius: 3px;
            cursor: pointer;
            height: 24px;
            line-height: 24px;
            margin-left: 10px;
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
                z-index: 5;

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
                        overflow: hidden;
                        text-overflow: ellipsis;
                        width: 150px;
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
<style lang="scss">
    body {
        .component-labels{
            .iScrollHorizontalScrollbar {
                height: 5px !important;
            }
        }
    }
</style>
