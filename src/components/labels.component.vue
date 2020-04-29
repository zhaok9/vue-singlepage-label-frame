<template>
    <div class="component-labels">
        <template v-for="( item, index ) of labels">
            <div :class="{ active: item.active }" @click.stop="toggle(item)">
                <span>{{ $t(item.title) }}</span>
                <i v-if="index > 0" @click.stop="destroy( item)">&times;</i>
            </div>
        </template>
        <div class="more">V</div>
    </div>
</template>
<script>
    import { mapMutations, mapState } from "vuex";

    export default {
        name: 'ComponentLables',
        data() {
            return {
                labels: []
            }
        },
        props: ['source'],
        watch: {
            source(n){
                this.labels = n;
            }
        },
        computed: {
        },
        created(){},
        mounted(){
            this.labels = this.source;
        },
        methods: {
            ...mapMutations(["removeKeepAliveRouter"]),
            toggle( item ){
                this.$emit('getvalue', item);
            },
            destroy( item ){
                this.removeKeepAliveRouter( item );
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
        overflow: hidden;
        position: relative;
        user-select: none;
        width: 100%;

        div {
            align-items: center;
            cursor: pointer;
            display: flex;
            line-height: 32px;
            margin-left: -1px;
            padding: 0 10px;
            text-align: center;
            transition:  all .2s linear;

            span {
                min-width: 100px;
                max-width: 200px;
                overflow: hidden;
                text-overflow: ellipsis;
                text-indent: 25px;
                white-space: nowrap;
            }

            i {
                border-radius: 100%;
                font-size: 18px;
                height: 12px;
                line-height: 10px;
                margin-left: 15px;
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
            position: absolute;
            right: 0;
        }
    }
</style>
