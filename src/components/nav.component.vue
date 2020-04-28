<template>
    <div class="component-nav">
        <ul>
            <li v-for="item of navs">
                <span @click.preventDefault="go( item )" :class="{ active: item.active }">{{ item.title }}</span>
                <template v-if="item.children">
                    <component-nav :in="true" :source="item.children" @getvalue="go"></component-nav>
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
                navs: []
            }
        },
        props: ["source", "in"],
        watch: {
            source(n){
                this.navs = n;
            }
        },
        computed: {
            ...mapState(["currentKeepAlive"]),
        },
        created(){},
        mounted(){
            this.navs = this.source;
            !this.in ? this.$emit('getvalue', this.currentKeepAlive || this.navs[0]) : null;
        },
        methods: {
            go( item ){
                this.$emit('getvalue', item);
            }
        },
        beforeDestroy(){

        }
    }
</script>
<style scoped lang="scss">
    .component-nav {
    }
</style>
